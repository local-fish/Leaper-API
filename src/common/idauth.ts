import type App from "./app";
import { CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from "@nestjs/common"

const paramCaches = new WeakMap<any, Map<string, any>>()

abstract class IdAuthGuard<X> implements CanActivate {
	static create<T extends typeof IdAuthGuard<any>, V = T extends typeof IdAuthGuard<infer R> ? R : any>(this: T, getId: IdAuthGuard.IdGetter<V>): Constructable<T> {
		abstract class A extends this {
			getId = getId
		}
		return A as any
	}

	constructor(...args: any[]) {}

	descriptor = '?'

	static param<T extends typeof IdAuthGuard<any>, V = T extends typeof IdAuthGuard<infer R> ? R : any>(this: T, id: string, cast: (v: string) => V): Constructable<T> {
		let obj = paramCaches.get(this)
		if (!obj) paramCaches.set(this, obj = new Map())
		let param = obj.get(id)
		if (!param) obj.set(id, param = this.create(req => cast(req.params[id] as string)))

		return param
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (!this.getId) {
			throw new TypeError(`Cannot use IdAuthGuard(${this.descriptor}) directly (getId not implemented)`)
		}
		const req = context.switchToHttp().getRequest()
		if (!req.userId) {
			console.log('CourseGuard cannot determine userId - is AuthGuard provided?')
			throw new UnauthorizedException()
		}
		const x = await this.validate(req, req.userId, await this.getId(req))
		if (!x)
			throw new NotFoundException()

		return true
	}

	protected abstract validate(req: App.Request, userId: number, id: X): boolean | Promise<boolean>

	protected abstract getId: IdAuthGuard.IdGetter<X>
}

namespace IdAuthGuard {
	export type IdGetter<X> = (req: App.Request) => X | Promise<X>

	export abstract class Num extends IdAuthGuard<number|void> {
		static param<T extends typeof IdAuthGuard<number|void>>(this: T, id: string): Constructable<T> {
			return super.param.call(this, id, Number)
		}

		protected async validate(req: App.Request, userId: number, id: number|void) {
			return id != undefined && id == id && this.validateNum(req, userId, id)
		}

		protected abstract validateNum(req: App.Request, userId: number, id: number|void): boolean | Promise<boolean>
	}
}

export default IdAuthGuard
