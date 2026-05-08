import db from '#common/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class CourseProvider {
	async getCoursesFromUser(userid: number) {
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

	async getInfo(courseId: number) {
		return db.course.findFirst({
			select: { id: true, name: true },
			where: { id: courseId }
		})
	}

	async getUsers(courseId: number) {
		return db.user.findMany({
			select: { id: true, name: true, email: true, role: true },
			where: { courses: { some: { id: courseId } } }
		})
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
					where: { userId: userId }
				}
			},
			where: { courseId: courseId }
		})
		return q.map(v => ({ name: v.name, grade: v.grades[0]?.grade })) ?? []
	}

	async getSessions(courseId: number) {
		return db.courseSession.findMany({
			select: {
				topic: true,
				id: true,
				sessionNo: true,
				startTime: true,
				endTime: true,
				location: true
			},
			where: { courseId: courseId }
		})
	}

	async sessionHasUser(sessionId: number, userId: number) {
		return !!await db.courseSession.findFirst({
			select: { id: true },
			where: { id: sessionId, course: { users: { some: { id: userId } } } }
		})
	}

	async getSessionDetail(sessionId: number) {
		return db.courseSession.findFirst({
			select: {
				courseId: true,
				topic: true,
				id: true,
				sessionNo: true,
				startTime: true,
				endTime: true,
				location: true
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

export const courseProvider = new CourseProvider()