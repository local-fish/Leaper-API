import db from "../common/db";
import { ForumCommentUpdateManyMutationInput, ForumUpdateManyMutationInput } from "../../prisma/generated/models";
import UserProvider from "../user/provider";
import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

@Injectable()
class ForumProvider {
	async getForumsFromCourse(courseId: number): Promise<ForumProvider.ForumHeader[]> {
		return db.forum.findMany({
			select: {
				id: true, title: true, time: true,
				user: { select: { id: true, name: true } }
			},
			where: { courseId: courseId }
		})
	}

	async hasUser(forumId: number, userId: number) {
		return !!await db.forum.findFirst({
			where: {
				id: forumId,
				course: { users: { some: { id: userId } } }
			}
		})
	}

	async getInfo(forumId: number): Promise<ForumProvider.Forum|undefined> {
		const q = await db.forum.findFirst({
			select: {
				courseId: true, id: true, title: true, time: true, body: true,
				user: { select: { id: true, name: true } },
				_count: { select: { comments: true } },
			},
			where: { id: forumId }
		})
		if (!q) return
		const {_count, ...r} = q
		return { ...r, comments: q._count.comments, }
	}

	async getComments(forumId: number, parentId?: number | null): Promise<ForumProvider.Comment[]> {
		const q = await db.forumComment.findMany({
			select: {
				id: true, time: true, body: true,
				user: { select: { id: true, name: true } },
				_count: { select: { replies: true } },
			},
			where: { forumId: forumId, parentId: parentId ?? null }
		})
		return q.map(comment => {
			const {_count, ...r} = comment
			return { ...r, replies: _count.replies } as ForumProvider.Comment
		})

	}

	async create(opts: ForumProvider.CreateOptions): Promise<ForumProvider.Forum> {
		const q = await db.forum.create({
			data: {
				courseId: opts.courseId,
				userId: opts.userId,
				title: opts.title,
				body: opts.body,
				time: new Date()
			},
			select: {
				courseId: true, id: true, title: true, time: true, body: true,
				user: { select: { id: true, name: true } }
			}
		})
		return { ...q, comments: 0 }
	}

	async createComment(opts: ForumProvider.CommentCreateOptions): Promise<ForumProvider.Comment> {
		if (opts.parentId) {
			const valid = await db.forumComment.findFirst({ where: { id: opts.parentId, forumId: opts.forumId } })
			if (!valid) throw 'parentId and forumId does not match'
		}

		const q = await db.forumComment.create({
			data: {
				forumId: opts.forumId,
				parentId: opts.parentId,
				userId: opts.userId,
				body: opts.body,
				time: new Date()
			},
			select: {
				id: true, time: true, body: true,
				user: { select: { id: true, name: true } }
			}
		})
		return { ...q, replies: 0 }
	}

	async isOwner(forumId: number, userId: number) {
		return !!await db.forum.findFirst({
			select: { id: true },
			where: { id: forumId, userId: userId }
		})
	}

	async editForum(forumId: number, data: ForumUpdateManyMutationInput) {
		return db.forum.update({
			data: data,
			where: { id: forumId }
		})
	}

	async deleteForum(forumId: number) {
		return db.forum.delete({
			where: { id: forumId }
		})
	}

	async isCommentOwner(commentId: number, userId: number) {
		return !!await db.forumComment.findFirst({
			select: { id: true },
			where: { id: commentId, userId: userId }
		})
	}
	async editComment(commentId: number, data: ForumCommentUpdateManyMutationInput) {
		return db.forumComment.update({
			data: data,
			where: { id: commentId }
		})
	}

	async deleteComment(commentId: number) {
		return db.forumComment.delete({
			where: { id: commentId }
		})
	}
}

namespace ForumProvider {
	export class CreateOptions {
		@IsNumber()
		@ApiProperty({ type: 'number' })
		declare courseId: number

		@IsString()
		@MaxLength(50)
		@ApiProperty({ type: 'string', maxLength: 50 })
		declare title: string

		@IsString()
		@MaxLength(4000)
		@ApiProperty({ type: 'string', maxLength: 4000 })
		declare body: string

		declare userId: number
	}

	export class CommentCreateOptions {
		@IsNumber()
		@ApiProperty({ type: 'number' })
		declare forumId: number

		@IsOptional()
		@IsNumber()
		@ApiProperty({ type: 'number', required: false })
		declare parentId: number

		@IsString()
		@MaxLength(4000)
		@ApiProperty({ type: 'string', maxLength: 4000 })
		declare body: string

		declare userId: number
	}

	export class PostHeader {
		@ApiProperty({ type: 'number' })
		declare id: number
		@ApiProperty({ type: Date })
		declare time: Date
		@ApiProperty({ type: UserProvider.UserInfoHeader })
		declare user: UserProvider.UserInfoHeader
	}

	export class ForumHeader extends PostHeader {
		@ApiProperty({ type: 'string' })
		declare title: string
	}

	export class Forum extends ForumHeader {
		@ApiProperty({ type: 'number' })
		declare courseId: number
		@ApiProperty({ type: 'string' })
		declare body: string
		@ApiProperty({ type: 'number' })
		declare comments: number
	}

	export class Comment extends PostHeader {
		@ApiProperty({ type: 'number' })
		declare replies: number
	}
}

export default ForumProvider

export const forumProvider = new ForumProvider()
