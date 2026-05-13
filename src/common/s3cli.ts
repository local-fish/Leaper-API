import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { StreamingBlobPayloadInputTypes } from "@smithy/types";
import { S3Client } from "@aws-sdk/client-s3";

export default class S3Provider {
	constructor(public client: S3Client, public bucket: string) {}

	put(key: string, body: StreamingBlobPayloadInputTypes) {
		return this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: body
			})
		)
	}

	async list() {
		const l = await this.client.send(
			new ListObjectsCommand({
				Bucket: this.bucket
			})
		)
		return l.Contents ?? []
	}

	async delete(key: string) {
		return this.client.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		)
	}

	async get(key: string) {
		return await this.client.send(
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		)
	}
}
