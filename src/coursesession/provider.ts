import db from '#common/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class CourseSessionProvider {
	async hasUser(sessionId: number, userId: number) {
		return !!await db.courseSession.findFirst({
			where: { id: sessionId, course: { users: { some: { id: userId } } } }
		})
	}

	getSessionDetail(sessionId: number) {
		return db.courseSession.findFirst({
			select: {
				courseid: true,
				topic: true,
				id: true,
				sessionNo: true,
				startTime: true,
				endTime: true,
			},
			where: { id: sessionId }
		})
	}

	async getSessionMaterials(sessionId: number) {
		const files = await db.courseSession.findFirst({
			select: { files: { select: { name: true, size: true, hash: true } } },
			where: { id: sessionId },
		})
		return files?.files.map(v => ({ ...v, hash: Buffer.from(v.hash).toString('base64url') })) ?? []
	}
}

export const courseSessionProvider = new CourseSessionProvider()