import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../prisma/generated/client"
import { Pool } from "pg"
import assert from "assert"
import 'dotenv/config'

let adapter;

if (process.env.DATABASE_PROVIDER === 'postgresql') {
  assert(process.env.DATABASE_URL, 'DATABASE_URL not defined')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  adapter = new PrismaPg(pool)
} else {
  assert(process.env.DATABASE_HOST, 'DATABASE_HOST not defined')
  assert(process.env.DATABASE_USER, 'DATABASE_USER not defined')
  assert(process.env.DATABASE_PASSWORD, 'DATABASE_PASSWORD not defined')
  assert(process.env.DATABASE_NAME, 'DATABASE_NAME not defined')
  adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : undefined,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  })
}

const db = new PrismaClient({ adapter })
export default db
