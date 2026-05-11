import db from "#common/db";
import { Injectable } from "@nestjs/common";

export interface ScheduleQueryOptions {
	userId: number
	startTime: DateType,
	endTime: DateType
}

@Injectable()
export default class ScheduleProvider {
	async getUserCourseSchedule(opts: ScheduleQueryOptions) {
		const startTime = new Date(opts.startTime)
		const endTime = new Date(opts.endTime)

		const q = await db.course.findMany({
			select: {
				id: true,
				name: true,
				sessions: {
					select: { id: true, topic: true, startTime: true, endTime: true, location: true },
					where: {
						OR: [{ // within
							startTime: { gte: startTime },
							endTime: { lte: endTime }
						}, { // starting
							startTime: { gte: startTime, lte: endTime },
							endTime: { gte: endTime }
						}, { // ending
							startTime: { lte: startTime },
							endTime: { gte: startTime, lte: endTime }
						}]
					}
				}
			},
			where: { users: { some: { id: opts.userId } } },
		})

		return q.flatMap(v => v.sessions.map(s => ({
			type: 'course',
			courseId: v.id,
			courseName: v.name,
			sessionId: s.id,
			sessionName: s.topic,
			startTime: s.startTime,
			endTime: s.endTime,
			location: s.location,
		}))).sort(({startTime: a}, {startTime: b}) => a.getTime() - b.getTime())
	}

	async getUserSchedule(opts: ScheduleQueryOptions) {
		// currently only courses, custom schedule (like exam) is todo
		return this.getUserCourseSchedule(opts)
	}

  async getUpcomingSession(userId: number) {
    const now = new Date()
    const end = new Date();
    end.setMonth(end.getMonth() + 1);

    const sessions = await this.getUserCourseSchedule({
      userId,
      startTime: now,
      endTime: end
    })

    return sessions[0] ?? null
  }
}
