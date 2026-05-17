import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import type App from "../common/app";
import FileProvider from "./provider";
import AuthGuard from "../user/authguard";
import { NoSuchKey, NotFound } from "@aws-sdk/client-s3";

@Controller()
@ApiBearerAuth()
@UseGuards(AuthGuard)
export default class FileController {
	constructor(private svc: FileProvider) {}

	@Get('/file/:id')
	@ApiResponse({
		status: 301,
		description: 'Redirects to the file download link'
	})
	async getFile(@Param('id') id: string, @Response() res: App.Response) {
		try {
			await this.svc.head(id)
			res.redirect(await this.svc.getPresign(id))
		} catch(e) {
			if (e instanceof NoSuchKey || e instanceof NotFound) throw new NotFoundException()

			throw new InternalServerErrorException(null, { cause: e })
		}
	}
}
