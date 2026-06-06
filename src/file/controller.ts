import { Body, Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post, Req, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import type App from "../common/app";
import FileProvider from "./provider";
import AuthGuard from "../user/authguard";
import { NoSuchKey, NotFound } from "@aws-sdk/client-s3";
import { PresignBody } from "./dto/presign";
import { LecturerGuard } from "./guard";
import db from "../common/db";


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
      const file = await db.file.findUnique({ 
        where: { id },
        select: { name: true }
      })
			await this.svc.head(id)
      if (!file) throw new NotFoundException()
			res.redirect(await this.svc.getPresign(id, file.name))
		} catch(e) {
			if (e instanceof NoSuchKey || e instanceof NotFound) throw new NotFoundException()

			throw new InternalServerErrorException(null, { cause: e })
		}
	}

  @Post('/file/presign')
  @HttpCode(200)
  @UseGuards(LecturerGuard)
  async getPresign(@Req() req: App.Request, @Body() body: PresignBody) {
    return this.svc.getPutPresign(req.userId!, body.name, body.contentType)
  }

  @Post('/file/confirm/:key')
  @HttpCode(200)
  async confirmUpload(@Param('key') key: string) {
    try {
      return this.svc.confirmUpload(key)
    } catch(e) {
      if (e instanceof NoSuchKey || e instanceof NotFound) throw new NotFoundException()
      throw new InternalServerErrorException(null, { cause: e })
    }
  }
}
