import { Controller, UseGuards, Get, Request, Param, NotFoundException } from "@nestjs/common";
import CourseProvider from "./provider";
import AuthGuard from "../user/authguard";
import CourseGuard from "./guard";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import type App from "../common/app";
import UserProvider from "../user/provider";

@Controller()
@ApiBearerAuth()
@UseGuards(AuthGuard)
export default class CourseController {
	constructor(private svc: CourseProvider) {}

	@Get('/courses')
	@ApiResponse({ type: [CourseProvider.CourseHeader] })
	async getUserCourses(@Request() req: App.Request) {
		return this.svc.getCoursesFromUser(req.userId!)
	}

	@Get('/course/:id')
	@ApiResponse({ type: CourseProvider.Course })
	@UseGuards(CourseGuard.param('id'))
	async getInfo(@Param('id') id: number) {
		return this.svc.getInfo(id)
	}

	@Get('/course/:id/students')
	@ApiResponse({ type: [UserProvider.UserInfo] })
	@UseGuards(CourseGuard.param('id'))
	async getStudents(@Param('id') id: number) {
		return this.svc.getStudents(id)
	}

	@Get('/course/:id/sessions')
	@ApiResponse({ type: [CourseProvider.SessionHeader] })
	@UseGuards(CourseGuard.param('id'))
	async getSessions(@Param('id') id: number) {
		return this.svc.getSessions(id)
	}

	@Get('/course/:id/grades')
	@ApiResponse({ type: [CourseProvider.Grade] })
	@UseGuards(CourseGuard.param('id'))
	async getGrades(@Request() req: App.Request, @Param('id') id: number) {
		return this.svc.getUserCourseGrades(id, req.userId!)
	}

	@Get('/course/:id/lecturer/studentgrades')
	@ApiResponse({ type: [CourseProvider.GradeList] })
	@UseGuards(CourseGuard.Lecturer.param('id'))
	async getStudentGrades(@Param('id') id: number) {
		const r = this.svc.getCourseAllGrades(id)
		if (!r) throw new NotFoundException()
		return r
	}

	@Get('/grades')
	@ApiResponse({ type: [CourseProvider.CourseGrade] })
	async getUserGrades(@Request() req: App.Request) {
		return this.svc.getStudentAllGrades(req.userId!)
	}

	@Get('/session/:session')
	@ApiResponse({ type: CourseProvider.Session })
	@UseGuards(CourseGuard.Session.param('session'))
	async getSessionInfo(@Param('session') session: number) {
		return this.svc.getSessionDetail(session)
	}

	@Get('/session/:session/materials')
	@ApiOperation({ deprecated: true, description: 'Use `/session/:session` instead' })
	@UseGuards(CourseGuard.Session.param('session'))
	async getSession(@Param('session') session: number) {
		return this.svc.getSessionMaterials(session)
	}
}