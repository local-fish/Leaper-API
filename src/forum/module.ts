import { Module } from "@nestjs/common";
import ForumController from "./controller";
import ForumProvider from "./provider";
import AppJwt from "#common/jwt";
import CourseModule from "#course/module";

@Module({
	imports: [AppJwt, CourseModule],
	controllers: [ForumController],
	providers: [ForumProvider],
	exports: [ForumProvider],
})
export default class ForumModule {}
