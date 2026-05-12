import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../../prisma/generated/client"
import assert from "assert"

import 'dotenv/config'

assert(process.env.DATABASE_HOST, 'DATABASE_HOST not defined')
assert(process.env.DATABASE_USER, 'DATABASE_USER not defined')
assert(process.env.DATABASE_PASSWORD, 'DATABASE_PASSWORD not defined')
assert(process.env.DATABASE_NAME, 'DATABASE_NAME not defined')

const adapter = new PrismaMariaDb({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : undefined,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	connectionLimit: 5,
})
const db = new PrismaClient({
	adapter: adapter
})

export default db
