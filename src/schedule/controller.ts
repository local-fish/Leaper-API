import AuthGuard from "#user/authguard";
import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import ScheduleProvider from "./provider";
import type App from "#common/app";
import { IsDate } from "class-validator";
import { Type } from "class-transformer";

export class ScheduleQueryDto {
	@Type(() => Date)
	@IsDate()
	declare startTime: Date

	@Type(() => Date)
	@IsDate()
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
}