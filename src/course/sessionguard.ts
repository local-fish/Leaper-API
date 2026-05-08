import type App from "#common/app";
import { Injectable } from "@nestjs/common"
import CourseProvider from "./provider";
import IdAuthGuard from "#common/idauth";

@Injectable()
export default abstract class CourseSessionGuard extends IdAuthGuard<number|void> {
	static param<T extends typeof IdAuthGuard<number|void>>(this: T, id: string): Constructable<T> {
		return this.create(req => +req.params[id])
	}

	constructor(private courseSvc: CourseProvider) { super() }
	descriptor = 'CourseSession'

	protected async validate(req: App.Request, userId: number, sessionId: number|void) {
		return sessionId != undefined && sessionId == sessionId && await this.courseSvc.sessionHasUser(sessionId, userId)
	}
}
