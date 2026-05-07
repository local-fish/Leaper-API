import AuthGuard from "#user/authguard";
import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import CourseSessionProvider from "./provider";
import CourseSessionGuard from "./guard";

@Controller()
@UseGuards(AuthGuard)
export default class CourseSessionController {
	constructor(private svc: CourseSessionProvider) {}

	@Get('/session/:session')
	@UseGuards(CourseSessionGuard.param('session'))
	getSessionInfo(@Param('session', ParseIntPipe) session: number) {
		return this.svc.getSessionDetail(session)
	}

	@Get('/session/:session/materials')
	@UseGuards(CourseSessionGuard.param('session'))
	getSession(@Param('session', ParseIntPipe) session: number) {
		return this.svc.getSessionMaterials(session)
	}

}
