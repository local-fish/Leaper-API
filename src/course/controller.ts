import { Controller, UseGuards, Get, Request, Param, ParseIntPipe, NotFoundException, Req } from "@nestjs/common";
import CourseProvider from "./provider";
import AuthGuard from "#user/authguard";
import type App from "#common/app";

@Controller()
@UseGuards(AuthGuard)
export default class CourseController {
	constructor(private svc: CourseProvider) {}

	async guard(req: App.Request, courseId: number) {
		if (!await this.svc.hasUser(courseId, req.userId!)) throw new NotFoundException()
	}

	@Get('/courses')
	getCourses(@Request() req: App.Request) {
		return this.svc.getCoursesFromUser(req.userId!)
	}

	@Get('/course/:id')
	async getInfo(@Request() req: App.Request, @Param('id', ParseIntPipe) id: number) {
		await this.guard(req, id)

		const course = await this.svc.getInfo(id)
		if (course) return course
		throw new NotFoundException()
	}

	@Get('/course/:id/students')
	async getStudents(@Request() req: App.Request, @Param('id', ParseIntPipe) id: number) {
		await this.guard(req, id)
		return this.svc.getUsers(id)
	}

	@Get('/course/:id/grades')
	async getCourseGrades(@Request() req: App.Request, @Param('id', ParseIntPipe) id: number) {
		await this.guard(req, id)
		return this.svc.getUserGradesCourse(id, req.userId!)
	}

	@Get('/grades')
	async getUserGrades(@Request() req: App.Request) {
		return this.svc.getUserGrades(req.userId!)
	}

}