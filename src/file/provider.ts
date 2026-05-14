import { Injectable } from "@nestjs/common";
import db from "../common/db";
import crypto from "crypto"
import S3 from "../common/s3";
import type { StreamingBlobPayloadInputTypes } from "@smithy/types";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
class FileProvider {
	s3 = S3

	protected getCurrentGcCluster() {
		let t = Math.floor(Date.now() / 86400000) % 30 - 2
		if (t < 0) t += 30
		return t
	}

	protected randomKey() {
		return crypto.randomBytes(15).toString('base64url')
	}

	async getUsageByUser(userId: number) {
		const q = await db.file.aggregate({
			_sum: { size: true },
			where: { userId: userId }
		})
		return q._sum.size ?? 0
	}

	async deleteMany(ids: Iterable<string> | ArrayLike<string>) {
		const res = await Promise.allSettled(
			Array.from(ids, async id => {
				await this.s3.delete(id);
				return id
			})
		)

		const suc = res.filter(v => v.status == 'fulfilled').map(v => v.value)

		await db.file.deleteMany({ where: { id: { in: suc } } })
	}

	async removeStale(clustered = true) {
		const q = await db.file.findMany({
			select: { id: true },
			where: {
				courseSessions: { none: {} },
				gcCluster: clustered ? this.getCurrentGcCluster() : undefined
			}
		})
		await this.deleteMany(q.map(v => v.id))
	}

	async removeLinger() {
		const keysInBucket = (await this.s3.list()).map(v => v.Key).filter(v => v) as string[]
		const keysInDb = new Set((await db.file.findMany({ select: { id: true } })).map(v => v.id))
		const delta = new Set(keysInBucket).difference(new Set(keysInDb))

		await this.deleteMany(Array.from(delta))
	}

	async put(opts: FileProvider.PutOptions) {
		const { userId, name, stream, key = this.randomKey() } = opts
		const res = await this.s3.put(key, stream)

		await db.file.create({
			data: {
				id: key,
				name: name,
				userId: userId,
				size: res.Size ?? 0,
				gcCluster: this.getCurrentGcCluster(),
			}
		})

		return key
	}

	async get(key: string) {
		return this.s3.get(key)
	}

	async head(key: string) {
		return this.s3.head(key)
	}

	async getPresign(key: string) {
		return this.s3.getPresign(undefined, key)
	}
}

namespace FileProvider {
	export interface PutOptions {
		userId: number
		name: string
		stream: StreamingBlobPayloadInputTypes
		key?: string
	}

	export class  File {
		@ApiProperty({ type: 'string' })
		declare id: string
		@ApiProperty({ type: 'string' })
		declare name: string
		@ApiProperty({ type: 'number' })
		declare size: number
	}
}

export const fileProvider = new FileProvider

export default FileProvider