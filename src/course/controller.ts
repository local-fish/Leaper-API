import { Controller, UseGuards, Get, Request, Param, ParseIntPipe, NotFoundException, Req } from "@nestjs/common";
import CourseProvider from "./provider";
import AuthGuard from "#user/authguard";
import type App from "#common/app";
import CourseGuard from "./guard";

@Controller()
@UseGuards(AuthGuard)
export default class CourseController {
	constructor(private svc: CourseProvider) {}

	@Get('/courses')
	getUserCourses(@Request() req: App.Request) {
		return this.svc.getCoursesFromUser(req.userId!)
	}

	@Get('/course/:id')
	@UseGuards(CourseGuard.param('id'))
	async getInfo(@Param('id', ParseIntPipe) id: number) {
		const course = await this.svc.getInfo(id)
		if (course) return course
		throw new NotFoundException()
	}

	@Get('/course/:id/students')
	@UseGuards(CourseGuard.param('id'))
	async getStudents(@Param('id', ParseIntPipe) id: number) {
		return this.svc.getUsers(id)
	}

	@Get('/course/:id/sessions')
	@UseGuards(CourseGuard.param('id'))
	async getSessions(@Param('id', ParseIntPipe) id: number) {
		return this.svc.getSessions(id)
	}

	@Get('/course/:id/grades')
	@UseGuards(CourseGuard.param('id'))
	async getGrades(@Request() req: App.Request, @Param('id', ParseIntPipe) id: number) {
		return this.svc.getUserGradesCourse(id, req.userId!)
	}

	@Get('/grades')
	async getUserGrades(@Request() req: App.Request) {
		return this.svc.getUserGrades(req.userId!)
	}
}