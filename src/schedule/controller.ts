import AuthGuard from "#user/authguard";
import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import ScheduleProvider from "./provider";
import type App from "#common/app";
import { IsDate } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ScheduleQueryDto {
	@Type(() => Date)
	@IsDate()
	@ApiProperty({ type: Date })
	declare startTime: Date

	@Type(() => Date)
	@IsDate()
	@ApiProperty({ type: Date })
	declare endTime: Date
}

@Controller()
@UseGuards(AuthGuard)
export default class ScheduleController {
	constructor(private svc: ScheduleProvider) {}

	// Note: TZ will use the host's TZ offset
	@Get('/schedule/:startTime/:endTime')
	async getSchedule(@Request() req: App.Request, @Param() params: ScheduleQueryDto) {
		return this.svc.getUserSchedule({
			userId: req.userId!,
			startTime: params.startTime,
			endTime: params.endTime
		})
	}

  @Get('/schedule/upcoming')
  async getNextSchedule(@Request() req: App.Request) {
    return this.svc.getUpcomingSession(req.userId!)
  }
}
