import type App from "#common/app";
import { Injectable } from "@nestjs/common"
import CourseProvider from "./provider";
import IdAuthGuard from "#common/idauth";

@Injectable()
export default abstract class CourseGuard extends IdAuthGuard<number|void> {
	static param<T extends typeof IdAuthGuard<number|void>>(this: T, id: string): Constructable<T> {
		return this.create(req => +req.params[id])
	}

	constructor(private courseSvc: CourseProvider) { super() }

	protected async validate(req: App.Request, userId: number, courseId: number|void) {
		return courseId != undefined && await this.courseSvc.hasUser(courseId, userId)
	}
}
