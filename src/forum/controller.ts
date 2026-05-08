import { Controller, Get, Param, ParseIntPipe, UseGuards, Query, Patch, Body, Delete, Post, Request } from "@nestjs/common";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import ForumProvider from "./provider";
import CourseGuard from "#course/guard";
import AuthGuard from "#user/authguard";
import ForumGuard from "./guard";
import type App from "#common/app";

export namespace ForumControllerOpts {
	export class ForumCreate {
		@IsNumber()
		declare courseId: number

		@IsString()
		@MaxLength(50)
		declare title: string

		@IsString()
		@MaxLength(4000)
		declare body: string
	}

	export class CommentCreate {
		@IsNumber()
		declare forumId: number

		@IsOptional()
		@IsNumber()
		declare parentId: number

		@IsString()
		@MaxLength(4000)
		declare body: string
	}

	export class ForumEdit {
		@IsNumber()
		declare id: number

		@IsOptional()
		@IsString()
		@MaxLength(50)
		title?: string

		@IsOptional()
		@IsString()
		@MaxLength(4000)
		body?: string
	}

	export class CommentEdit {
		@IsNumber()
		declare id: number

		@IsOptional()
		@IsString()
		@MaxLength(4000)
		body?: string
	}
}

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

	@Patch('/forum/edit')
	@UseGuards(ForumGuard.Owner.create(req => req.body.id))
	async editForum(@Body() opts: ForumControllerOpts.ForumEdit) {
		await this.svc.editForum(opts.id, {
			title: opts.title,
			body: opts.body
		})
	}

	@Delete('/forum/:id')
	@UseGuards(ForumGuard.Owner.param('id'))
	async deleteForum(@Param('id') id: number) {
		await this.svc.deleteForum(id)
	}

	@Patch('/forum/comment/edit')
	@UseGuards(ForumGuard.CommentOwner.create(req => req.body.id))
	async editComment(@Body() opts: ForumControllerOpts.CommentEdit) {
		await this.svc.editComment(opts.id, {
			body: opts.body
		})
	}

	@Delete('/forum/comment/:id')
	@UseGuards(ForumGuard.CommentOwner.param('id'))
	async deleteComment(@Param('id') id: number) {
		await this.svc.deleteComment(id)
	}

	@Post('/forum/new')
	@UseGuards(CourseGuard.create(req => req.body.courseId))
	async createForum(@Request() req: App.Request, @Body() opts: ForumControllerOpts.ForumCreate) {
		return this.svc.create({
			body: opts.body,
			courseId: opts.courseId,
			title: opts.title,
			userId: req.userId!
		})
	}

	@Post('/forum/comment/new')
	@UseGuards(ForumGuard.create(req => req.body.forumId))
	async createForumComment(@Request() req: App.Request, @Body() opts: ForumControllerOpts.CommentCreate) {
		return this.svc.createComment({
			body: opts.body,
			forumId: opts.forumId,
			parentId: opts.parentId,
			userId: req.userId!
		})
	}

}
