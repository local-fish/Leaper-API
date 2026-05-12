import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
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
	@ApiOperation({
		description: 'Specified `startTime` and `endTime` should use the UTC timezone, otherwise the host timezone will be used.'
			+ '\n\nTimezones may be adjusted within the request (e.g. GMT+7: `2026-01-02T00:00` -> `2026-01-01T17:00Z`)',
	})
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
