import { DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput, HeadObjectCommand, HeadObjectCommandInput, ListObjectsCommand, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { RequestPresigningArguments, StreamingBlobPayloadInputTypes } from "@smithy/types";
import { S3Client } from "@aws-sdk/client-s3";

export default class S3Provider {
	constructor(public client: S3Client, public bucket: string) {}

	createGet(key: string, opts?: Partial<GetObjectCommandInput>) {
		return new GetObjectCommand({ Bucket: this.bucket, Key: key, ...opts })
	}

	createHead(key: string, opts?: Partial<HeadObjectCommandInput>) {
		return new HeadObjectCommand({ Bucket: this.bucket, Key: key, ...opts })
	}

	createPut(key: string, body: StreamingBlobPayloadInputTypes, opts?: Partial<PutObjectCommandInput>) {
		return new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ...opts })
	}

	createDelete(key: string, opts?: Partial<DeleteObjectCommandInput>) {
		return new DeleteObjectCommand({ Bucket: this.bucket, Key: key, ...opts })
	}

	put(...params: Parameters<S3Provider['createPut']>) { return this.client.send(this.createPut(...params)) }
	head(...params: Parameters<S3Provider['createHead']>) { return this.client.send(this.createHead(...params)) }
	get(...params: Parameters<S3Provider['createGet']>) { return this.client.send(this.createGet(...params)) }
	delete(...params: Parameters<S3Provider['createDelete']>) { return this.client.send(this.createDelete(...params)) }

	async putPresign(signOpts?: RequestPresigningArguments, ...params: Parameters<S3Provider['createPut']>) {
		return getSignedUrl(this.client, this.createPut(...params), signOpts ?? { expiresIn: 3600 })
	}

	async getPresign(signOpts?: RequestPresigningArguments, ...params: Parameters<S3Provider['createGet']>) {
		return getSignedUrl(this.client, this.createGet(...params), signOpts ?? { expiresIn: 3600 })
	}

	async list(opts?: Partial<GetObjectCommandInput>) {
		const l = await this.client.send(
			new ListObjectsCommand({ Bucket: this.bucket, ...opts })
		)
		return l.Contents ?? []
	}
}
