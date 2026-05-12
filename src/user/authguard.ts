import type App from "../common/app";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export default class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException()

		try {
			const payload = await this.jwtService.verifyAsync(token);
			request.userId = payload.userId;
			request.userRole = payload.userRole;
		} catch(e) {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: App.Request): string|void {
		const auth = request.headers.authorization as string
		return auth?.startsWith('Bearer ') ? auth.slice(7) : undefined
	}
}
