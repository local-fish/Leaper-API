import { Module } from "@nestjs/common";
import AssessmentController from "./controller";
import AssessmentProvider from "./provider";

@Module({
	controllers: [AssessmentController],
	providers: [AssessmentProvider],
	exports: [AssessmentProvider]
})
export default class AssessmentModule {}