import type App from "#common/app";
import { Injectable } from "@nestjs/common"
import IdAuthGuard from "#common/idauth";
import ForumProvider from "./provider";

@Injectable()
export default abstract class ForumGuard extends IdAuthGuard<number|void> {
	static param<T extends typeof IdAuthGuard<number|void>>(this: T, id: string): Constructable<T> {
		return this.create(req => +req.params[id])
	}

	constructor(private forumSvc: ForumProvider) { super() }
	descriptor = 'Forum'

	protected async validate(req: App.Request, userId: number, forumId: number|void) {
		return forumId != undefined && forumId == forumId && await this.forumSvc.hasUser(forumId, userId)
	}
}
