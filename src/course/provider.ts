import db from '../common/db'
import FileProvider from '../file/provider'
import UserProvider from '../user/provider'
import { Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

@Injectable()
class CourseProvider {
	async getCoursesFromUser(userid: number): Promise<CourseProvider.CourseHeader[]> {
		const q = await db.course.findMany({
			select: {
				id: true, name: true,
				lecturers: { select: { id: true, name: true, email: true, role: true } },
				_count: { select: { users: true, sessions: true } }
			},
			where: { users: { some: { id: userid } } }
		})
		return q.map(({ _count, ...course }): CourseProvider.CourseHeader => ({ ...course, studentCount: _count.users, sessionCount: _count.sessions }))
	}

	async hasUser(courseId: number, userId: number) {
		return !!await db.course.findFirst({
			select: { id: true },
			where: { id: courseId, users: { some: { id: userId } } }
		})
	}

	async getInfo(courseId: number): Promise<CourseProvider.Course | undefined> {
		const q = await db.course.findFirst({
			select: {
				id: true, name: true,
				lecturers: { select: { id: true, name: true, email: true, role: true } },
				_count: { select: { users: true, sessions: true } }
			},
			where: { id: courseId }
		})
		if (!q) return
		const {_count, ...course} = q
		return {
			...course,
			sessionCount: _count.sessions,
			studentCount: _count.users
		}

	}

	async getUsers(courseId: number): Promise<UserProvider.UserInfo[]> {
		return db.user.findMany({
			select: { id: true, name: true, email: true, role: true },
			where: { courses: { some: { id: courseId } } }
		})
	}

	async getUserGrades(userId: number): Promise<CourseProvider.CourseGrade[]> {
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
				component: v.name,
				grade: v.grades[0]?.grade
			}))
		}))
	}

	async getUserGradesCourse(courseId: number, userId: number): Promise<CourseProvider.Grade[]> {
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
		return q.map(v => ({ component: v.name, grade: v.grades[0]?.grade })) ?? []
	}

	async getSessions(courseId: number): Promise<CourseProvider.SessionHeader[]> {
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

	async getSessionDetail(sessionId: number): Promise<CourseProvider.Session | null> {
		return db.courseSession.findFirst({
			select: {
				courseId: true,
				topic: true,
				id: true,
				sessionNo: true,
				startTime: true,
				endTime: true,
				location: true,

				files: {
					select: {
						id: true,
						name: true,
						size: true
					}
				}
			},
			where: { id: sessionId }
		})
	}

	/** @deprecated Use {@link getSessionDetail} instead */
	async getSessionMaterials(sessionId: number) {
		return await db.file.findMany({
			select: { name: true, size: true, id: true },
			where: { courseSessions: { some: { id: sessionId } } }
		})
	}
}

namespace CourseProvider {
	export class CourseHeader {
		@ApiProperty({ type: 'number' })
		declare id: number
		@ApiProperty({ type: 'string' })
		declare name: string
		@ApiProperty({ type: 'number' })
		declare studentCount: number
		@ApiProperty({ type: 'number' })
		declare sessionCount: number
	}

	export class Course extends CourseHeader {
		@ApiProperty({ type: [UserProvider.UserInfo] })
		declare lecturers: UserProvider.UserInfo[]
	}

	export class Grade {
		@ApiProperty({ type: 'string' })
		declare component: string
		@ApiProperty({ type: 'number', required: false })
		declare grade?: number
	}

	export class CourseGrade {
		@ApiProperty({ type: 'number' })
		declare courseId: number
		@ApiProperty({ type: 'string' })
		declare courseName: string
		@ApiProperty({ type: [Grade] })
		declare components: Grade[]
	}

	export class SessionHeader {
		@ApiProperty({ type: 'number' })
		declare id: number
		@ApiProperty({ type: 'number' })
		declare sessionNo: number
		@ApiProperty({ type: Date })
		declare startTime: Date
		@ApiProperty({ type: Date })
		declare endTime: Date
		@ApiProperty({ type: 'string' })
		declare location: string
		@ApiProperty({ type: 'string' })
		declare topic: string
	}

	export class Session extends SessionHeader {
		@ApiProperty({ type: 'number' })
		declare courseId: number
		@ApiProperty({ type: [FileProvider.File] })
		declare files: FileProvider.File[]
	}
}

export default CourseProvider

export const courseProvider = new CourseProvider()
