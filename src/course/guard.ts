import type App from "../common/app";
import { Injectable } from "@nestjs/common"
import CourseProvider from "./provider";
import IdAuthGuard from "../common/idauth";

@Injectable()
abstract class CourseGuard extends IdAuthGuard.Num {
	constructor(private courseSvc: CourseProvider) { super() }
	descriptor = 'Course'

	protected async validateNum(req: App.Request, userId: number, courseId: number) {
		return this.courseSvc.hasUser(courseId, userId)
	}
}

namespace CourseGuard {
	@Injectable()
	export abstract class Session extends IdAuthGuard.Num {
		constructor(private courseSvc: CourseProvider) { super() }
		descriptor = 'CourseSession'

		protected async validateNum(req: App.Request, userId: number, sessionId: number) {
			return this.courseSvc.sessionHasUser(sessionId, userId)
		}
	}

	@Injectable()
	export abstract class Lecturer extends IdAuthGuard.Num {
		constructor(private courseSvc: CourseProvider) { super() }
		descriptor = 'CourseLecturer'

		protected async validateNum(req: App.Request, userId: number, courseId: number) {
			return this.courseSvc.isLecturer(courseId, userId)
		}
	}
}

export default CourseGuard