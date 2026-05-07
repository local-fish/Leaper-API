import AuthProvider from "./provider";
import { Body, Controller, HttpCode, HttpException, Post, UnauthorizedException } from "@nestjs/common";
import { IsString } from "class-validator";

export class LoginBody {
	@IsString()
	declare username: string
	@IsString()
	declare password: string
}

@Controller()
export default class AuthController {
	constructor(public svc: AuthProvider) {}

	@HttpCode(200)
	@Post('/login')
	async login(@Body() req: LoginBody) {
		const account = await this.svc.getIdentifier(req.username, req.password)
		if (!account) throw new UnauthorizedException('Invalid username or password')
		const key = await this.svc.generateKey(account)
		return { token: key }
	}
}
