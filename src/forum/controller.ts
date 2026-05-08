import { Controller, Get, Param, ParseIntPipe, UseGuards, Query, DefaultValuePipe } from "@nestjs/common";
import ForumProvider from "./provider";
import CourseGuard from "#course/guard";
import AuthGuard from "#user/authguard";
import ForumGuard from "./guard";

@Controller()
@UseGuards(AuthGuard)
export default class ForumController {
	constructor(private svc: ForumProvider) {}

	@Get('/course/:id/forums')
	@UseGuards(CourseGuard.param('id'))
	async getForums(@Param('id') id: number) {
		return this.svc.getForumsFromCourse(id)
	}

	@Get('/forum/:id')
	@UseGuards(ForumGuard.param('id'))
	async getInfo(@Param('id') id: number) {
		return this.svc.getInfo(id)
	}

	@Get('/forum/:id/comments')
	@UseGuards(ForumGuard.param('id'))
	async getComments(
		@Param('id') id: number,
		@Query('replyId', new ParseIntPipe({ optional: true })) replyId?: number
	) {
		return this.svc.getComments(id, replyId)
	}
}
