import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import App from "../common/app"

@Injectable()
export class LecturerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<App.Request>()
    return req.userRole === 'Teacher'
  }
}
