import { Module } from "@nestjs/common";
import UserController from "./controller";
import UserProvider from "./provider";
import AppJwt from "../common/jwt";

@Module({
	imports: [AppJwt],
	controllers: [UserController],
	providers: [UserProvider],
	exports: [UserProvider]
})
export default class UserModule {}