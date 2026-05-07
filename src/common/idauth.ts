import type App from "#common/app";
import { CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from "@nestjs/common"

abstract class IdAuthGuard<X> implements CanActivate {
	static create<T extends typeof IdAuthGuard<any>, V = T extends typeof IdAuthGuard<infer R> ? R : any>(this: T, getId: IdAuthGuard.IdGetter<V>): Constructable<T> {
		abstract class A extends this {
			getId = getId
		}
		return A as any
	}

	constructor(...args: any[]) {}

	static param<T extends typeof IdAuthGuard<any>, V = T extends typeof IdAuthGuard<infer R> ? R : any>(this: T, id: string, cast: (v: string) => V): Constructable<T> {
		return this.create(req => cast(req.params[id] as string))
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
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
}

export default IdAuthGuard