import db from '#common/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class CourseProvider {
	getCoursesFromUser(userid: number) {
		return db.course.findMany({
			select: { id: true, name: true },
			where: { users: { some: { id: userid } } }
		})
	}

	async hasUser(courseId: number, userId: number) {
		return !!await db.course.findFirst({
			select: { id: true },
			where: { id: courseId, users: { some: { id: userId } } }
		})
	}

	getInfo(courseId: number) {
		return db.course.findFirst({
			select: { id: true, name: true },
			where: { id: courseId }
		})
	}

	async getUsers(courseId: number) {
		const r = await db.course.findFirst({
			select: { users: { select: { id: true, name: true, email: true, role: true } } },
			where: { id: courseId }
		})
		return r?.users ?? []
	}

	async getUserGrades(userId: number) {
		const r = await db.course.findMany({
			select: {
				id: true,
				name: true,
				gradesComp: {
					select: {
						name: true,
						grades: {
							select: {
								grade: true
							}
						}
					}
				}
			},
			where: { users: { some: { id: userId } } }
		})
		return r.map(v => ({
			courseId: v.id,
			courseName: v.name,
			components: v.gradesComp.map(v => ({
				name: v.name,
				grade: v.grades[0]?.grade
			}))
		}))
	}

	async getUserGradesCourse(courseId: number, userId: number) {
		const q = await db.courseGradeComp.findMany({
			select: {
				name: true,
				grades: {
					select: { grade: true },
					where: { userid: userId }
				}
			},
			where: { courseid: courseId }
		})
		return q.map(v => ({ name: v.name, grade: v.grades[0]?.grade })) ?? []
	}

	async getSessions(courseId: number) {
		const q = await db.course.findFirst({
			select: {
				sessions: {
					select: {
						topic: true,
						id: true,
						sessionNo: true,
						startTime: true,
						endTime: true
					}
				}
			},
			where: { id: courseId }
		})
		return q?.sessions ?? []
	}

	async sessionHasUser(sessionId: number, userId: number) {
		return !!await db.courseSession.findFirst({
			select: { id: true },
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

export const courseProvider = new CourseProvider()