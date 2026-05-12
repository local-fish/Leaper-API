import db from "../common/db";
import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

@Injectable()
class ScheduleProvider {
	async getUserCourseSchedule(opts: ScheduleProvider.QueryOptions) {
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

		return q.flatMap(v =>
			v.sessions.map(s => ({
				type: 'course',
				courseId: v.id,
				courseName: v.name,
				sessionId: s.id,
				sessionName: s.topic,
				startTime: s.startTime,
				endTime: s.endTime,
				location: s.location,
			}) as ScheduleProvider.QueryResponse
		)).sort(
			({startTime: a}, {startTime: b}) => a.getTime() - b.getTime()
		)
	}

	async getUserSchedule(opts: ScheduleProvider.QueryOptions) {
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

namespace ScheduleProvider {
	export class QueryOptions {
		declare userId: number

		@Type(() => Date)
		@IsDate()
		@ApiProperty({ type: Date, default: '2026-01-01' })
		declare startTime: DateType

		@Type(() => Date)
		@IsDate()
		@ApiProperty({ type: Date, default: '2026-12-31' })
		declare endTime: DateType
	}
	export class QueryResponse {
		@ApiProperty({ type: 'string' })
		declare type: string
		@ApiProperty({ type: 'number' })
		declare courseId: number
		@ApiProperty({ type: 'string' })
		declare courseName: string
		@ApiProperty({ type: 'number' })
		declare sessionId: number
		@ApiProperty({ type: 'string' })
		declare sessionName: string
		@ApiProperty({ type: Date })
		declare startTime: Date
		@ApiProperty({ type: Date })
		declare endTime: Date
		@ApiProperty({ type: 'string' })
		declare location: string
	}
}

export default ScheduleProvider