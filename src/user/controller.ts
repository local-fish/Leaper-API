import { Controller, UseGuards, Get, Request } from "@nestjs/common";
import AuthGuard from "./authguard";
import UserProvider from "./provider";
import type App from "#common/app";

@Controller()
@UseGuards(AuthGuard)
export default class UserController {
	constructor(private svc: UserProvider) {}

	@Get('/user/info')
	async getUserInfo(@Request() req: App.Request) {
		return this.svc.getInfo(req.userId!)
	}
}
