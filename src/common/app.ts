import { Module } from "@nestjs/common";
import AuthModule from "#auth/module";
import UserModule from "#user/module";
import type express from "express"
import CourseModule from "#course/module";
import CourseSessionModule from "#coursesession/module";

@Module({
	imports: [AuthModule, UserModule, CourseModule, CourseSessionModule]
})
class App {}

declare namespace App {
	interface Request extends express.Request {
		userId?: number
		userRole?: string
	}
}

export default App