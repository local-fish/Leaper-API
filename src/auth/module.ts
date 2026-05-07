import { Module } from "@nestjs/common";
import AuthController from "./controller";
import AuthProvider from "./provider";
import assert from 'assert'
import UserModule from "#user/module";
import AppJwt from "#common/jwt";

assert(process.env.PASSWORD_SECRET, 'PASSWORD_SECRET not defined')
assert(process.env.JWT_SECRET, 'JWT_SECRET not defined')

@Module({
	imports: [UserModule, AppJwt],
	controllers: [AuthController],
	providers: [AuthProvider]
})
export default class AuthModule {}
