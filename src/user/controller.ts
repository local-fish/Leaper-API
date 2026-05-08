import { Controller, UseGuards, Get, Request, NotFoundException } from "@nestjs/common";
import AuthGuard from "./authguard";
import UserProvider from "./provider";
import type App from "#common/app";

@Controller()
@UseGuards(AuthGuard)
export default class UserController {
	constructor(private svc: UserProvider) {}

	@Get('/user/info')
	async getUserInfo(@Request() req: App.Request) {
		const info = this.svc.getInfo(req.userId!)
		if (info) return info
		throw new NotFoundException()
	}
}
