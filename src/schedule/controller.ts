import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import AuthGuard from "#user/authguard";
import ScheduleProvider from "./provider";
import type App from "#common/app";

@Controller()
@ApiBearerAuth()
@UseGuards(AuthGuard)
export default class ScheduleController {
	constructor(private svc: ScheduleProvider) {}

	// Note: TZ will use the host's TZ offset
	@Get('/schedule/:startTime/:endTime')
	@ApiResponse({ type: [ScheduleProvider.QueryResponse] })
	async getSchedule(@Request() req: App.Request, @Param() params: ScheduleProvider.QueryOptions) {
		return this.svc.getUserSchedule({
			userId: req.userId!,
			startTime: params.startTime,
			endTime: params.endTime
		})
	}

  @Get('/schedule/upcoming')
  @ApiResponse({ type: ScheduleProvider.QueryResponse })
  async getNextSchedule(@Request() req: App.Request) {
    return this.svc.getUpcomingSession(req.userId!)
  }
}
