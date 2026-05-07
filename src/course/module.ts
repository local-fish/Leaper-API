import { Module } from "@nestjs/common";
import CourseController from "./controller";
import CourseProvider from "./provider";
import AppJwt from "#common/jwt";

@Module({
	imports: [AppJwt],
	controllers: [CourseController],
	providers: [CourseProvider],
	exports: [CourseProvider]
})
export default class CourseModule {}