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

	getUsers(courseId: number) {
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
					where: { userid: userId }
				}
			},
			where: { courseid: courseId }
		})
		return q.map(v => ({ name: v.name, grade: v.grades[0]?.grade })) ?? []
	}
}

export const courseProvider = new CourseProvider()