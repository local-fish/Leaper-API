import db from "#common/db";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class ForumProvider {
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
}

export const forumProvider = new ForumProvider()
