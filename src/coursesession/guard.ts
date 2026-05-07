import type App from "#common/app";
import { Injectable } from "@nestjs/common"
import IdAuthGuard from "#common/idauth";
import CourseSessionProvider from "./provider";

@Injectable()
export default abstract class CourseGuard extends IdAuthGuard<number|void> {
	static param<T extends typeof IdAuthGuard<number|void>>(this: T, id: string): Constructable<T> {
		return this.create(req => +req.params[id])
	}

	constructor(private sessionSvc: CourseSessionProvider) { super() }
	descriptor = 'CourseSession'

	protected async validate(req: App.Request, userId: number, sessionId: number|void) {
		return sessionId != undefined && await this.sessionSvc.hasUser(sessionId, userId)
	}
}
