import { Module } from "@nestjs/common";
import CourseSessionController from "./controller";
import CourseSessionProvider from "./provider";
import AppJwt from "#common/jwt";
import CourseModule from "#course/module";

@Module({
	imports: [AppJwt, CourseModule],
	controllers: [CourseSessionController],
	providers: [CourseSessionProvider]
})
export default class CourseSessionModule {}