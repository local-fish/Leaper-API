import AuthProvider from "./provider";
import { Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginBody {
	@IsString()
	@ApiProperty({ type: 'string' })
	declare username: string

	@IsString()
	@ApiProperty({ type: 'string' })
	declare password: string
}

@Controller()
export default class AuthController {
	constructor(private svc: AuthProvider) {}

	@HttpCode(200)
	@Post('/login')
	async login(@Body() req: LoginBody) {
		const account = await this.svc.getIdentifier(req.username, req.password)
		if (!account) throw new UnauthorizedException('Invalid username or password')
		const key = await this.svc.generateKey(account)
		return { token: key }
	}
}
