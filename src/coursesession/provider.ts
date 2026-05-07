import db from '#common/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class CourseSessionProvider {

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
		const files = await db.file.findMany({
			select: { name: true, size: true, hash: true },
			where: { courseSessions: { some: { id: sessionId } } }
		})
		return files.map(v => ({ ...v, hash: Buffer.from(v.hash).toString('base64url') }))
	}
}

export const courseSessionProvider = new CourseSessionProvider()