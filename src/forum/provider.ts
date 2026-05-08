import db from "#common/db";
import { ForumCommentUpdateManyMutationInput, ForumUpdateManyMutationInput } from "#prisma/models";
import { Injectable } from "@nestjs/common";

@Injectable()
class ForumProvider {
	async getForumsFromCourse(courseId: number) {
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

	async getInfo(forumId: number) {
		return db.forum.findFirst({
			select: {
				courseId: true, id: true, title: true, time: true, body: true,
				user: { select: { id: true, name: true } },
				_count: { select: { comments: true } },
			},
			where: { id: forumId }
		})
	}

	async getComments(forumId: number, parentId?: number | null) {
		return db.forumComment.findMany({
			select: {
				id: true, time: true, body: true,
				user: { select: { id: true, name: true } },
				_count: { select: { replies: true } },
			},
			where: { forumId: forumId, parentId: parentId ?? null }
		})
	}

	async create(opts: ForumProvider.CreateForumOptions) {
		return db.forum.create({
			data: {
				courseId: opts.courseId,
				userId: opts.userId,
				title: opts.title,
				body: opts.body,
				time: new Date()
			}
		})
	}

	async createComment(opts: ForumProvider.CreateCommentOptions) {
		if (opts.parentId) {
			const valid = await db.forumComment.findFirst({ where: { id: opts.parentId, forumId: opts.forumId } })
			if (!valid) throw 'parentId and forumId does not match'
		}

		return db.forumComment.create({
			data: {
				forumId: opts.forumId,
				parentId: opts.parentId,
				userId: opts.userId,
				body: opts.body,
				time: new Date()
			}
		})
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
	export interface CreateForumOptions {
		userId: number
		courseId: number
		title: string
		body: string
	}

	export interface CreateCommentOptions {
		userId: number
		forumId: number
		parentId?: number
		body: string
	}
}

export default ForumProvider

export const forumProvider = new ForumProvider()
