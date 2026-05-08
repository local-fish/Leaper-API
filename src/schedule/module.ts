import { Module } from "@nestjs/common";
import ScheduleController from "./controller";
import AppJwt from "#common/jwt";
import ScheduleProvider from "./provider";

@Module({
	providers: [ScheduleProvider],
	imports: [AppJwt],
	controllers: [ScheduleController]
})
export default class ScheduleModule {}