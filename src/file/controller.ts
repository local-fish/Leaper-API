import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import type App from "../common/app";
import FileProvider from "./provider";
import AuthGuard from "../user/authguard";
import stream from "stream"
import { NoSuchKey } from "@aws-sdk/client-s3";

@Controller()
@ApiBearerAuth()
@UseGuards(AuthGuard)
export default class FileController {
	constructor(private svc: FileProvider) {}

	@Get('/file/:id')
	async getFile(@Param('id') id: string, @Response() res: App.Response) {
		try {
			const file = await this.svc.get(id)

			if (file.ContentType) res.setHeader('content-type', file.ContentType)
			if (file.ContentLength) res.setHeader('content-length', file.ContentLength)
			if (file.ContentDisposition) res.setHeader('content-disposition', file.ContentDisposition)
			if (file.ContentEncoding) res.setHeader('content-encoding', file.ContentEncoding)
			if (file.ContentLanguage) res.setHeader('content-language', file.ContentLanguage)
			if (file.LastModified) res.setHeader('last-modified', file.LastModified.toUTCString())
			if (file.ETag) res.setHeader('etag', file.ETag)

			stream.Readable.fromWeb(file.Body!.transformToWebStream()).pipe(res)
		} catch(e) {
			if (e instanceof NoSuchKey) throw new NotFoundException()
			throw new InternalServerErrorException(null, { cause: e })
		}
	}
}
