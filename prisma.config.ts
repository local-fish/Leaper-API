import "dotenv/config";
import assert from "assert";
import { defineConfig } from "prisma/config";

assert(process.env.DATABASE_PROVIDER, "DATABASE_PROVIDER not set")

export default defineConfig({
	schema: `prisma/schema.${process.env.DATABASE_PROVIDER}.prisma`,
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: process.env["DATABASE_URL"],
	},
	typedSql: {
		path: "prisma/sql"
	}
});
