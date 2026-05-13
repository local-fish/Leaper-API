import { S3Client } from "@aws-sdk/client-s3";
import S3Provider from "./s3cli";
import assert from "assert"
import 'dotenv/config'

assert(process.env.S3_ENDPOINT, 'S3_ENDPOINT not defined')
assert(process.env.S3_ACCESS_KEY_ID, 'S3_ACCESS_KEY_ID not defined')
assert(process.env.S3_ACCESS_SECRET, 'S3_ACCESS_SECRET not defined')
assert(process.env.S3_BUCKET, 'S3_BUCKET not defined')

const client = new S3Client({
	region: "auto",
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_ACCESS_SECRET,
	}
});

const S3 = new S3Provider(client, process.env.S3_BUCKET)
export default S3