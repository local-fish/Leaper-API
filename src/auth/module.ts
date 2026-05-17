import { Module } from "@nestjs/common";
import AuthController from "./controller";
import AuthProvider from "./provider";
import assert from 'assert'
import UserModule from "../user/module";
import AppJwt from "../common/jwt";
@Module({
	imports: [UserModule, AppJwt],
	controllers: [AuthController],
	providers: [AuthProvider]
})
export default class AuthModule {}
