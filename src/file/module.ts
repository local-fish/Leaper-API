import { Module } from "@nestjs/common";
import FileController from "./controller";
import FileProvider from "./provider";
import AppJwt from "../common/jwt";

@Module({
	imports: [AppJwt],
	controllers: [FileController],
	providers: [FileProvider],
	exports: [FileProvider]
})
export default class FileModule {}