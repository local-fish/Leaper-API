import type App from "../common/app";
import { Injectable } from "@nestjs/common"
import IdAuthGuard from "../common/idauth";
import ForumProvider from "./provider";

@Injectable()
abstract class ForumGuard extends IdAuthGuard.Num {
	constructor(private forumSvc: ForumProvider) { super() }
	descriptor = 'Forum'

	protected async validateNum(req: App.Request, userId: number, forumId: number) {
		return this.forumSvc.hasUser(forumId, userId)
	}
}

namespace ForumGuard {
	@Injectable()
	export abstract class Owner extends IdAuthGuard.Num {
		constructor(private forumSvc: ForumProvider) { super() }
		descriptor = 'ForumOwner'

		protected async validateNum(req: App.Request, userId: number, forumId: number) {
			return this.forumSvc.isOwner(forumId, userId)
		}
	}
	@Injectable()
	export abstract class CommentOwner extends IdAuthGuard.Num {
		constructor(private forumSvc: ForumProvider) { super() }
		descriptor = 'ForumCommentOwner'

		protected async validateNum(req: App.Request, userId: number, forumId: number) {
			return this.forumSvc.isCommentOwner(forumId, userId)
		}
	}
}

export default ForumGuard