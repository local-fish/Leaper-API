import AuthProvider from "./provider";
import { Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { IsString } from "class-validator";

export namespace AuthControllerSchema {
	export class LoginBody {
		@IsString()
		@ApiProperty({ type: 'string' })
		declare email: string

		@IsString()
		@ApiProperty({ type: 'string' })
		declare password: string
	}
	export class LoginResponse {
		@ApiProperty({ type: 'string', example: '<JWT token>' })
		declare token: string
	}
}

@Controller()
export default class AuthController {
	constructor(private svc: AuthProvider) {}

	@HttpCode(200)
	@Post('/login')
	@ApiResponse({ type: AuthControllerSchema.LoginResponse })
	async login(@Body() req: AuthControllerSchema.LoginBody): Promise<AuthControllerSchema.LoginResponse> {
		const account = await this.svc.getIdentifier(req.email, req.password)
		if (!account) throw new UnauthorizedException('Invalid username or password')
		const key = await this.svc.generateKey(account)
		if (!key) throw new UnauthorizedException('Invalid username or password')

		return { token: key }
	}
}
