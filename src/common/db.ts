import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../../prisma/generated/client"
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({adapter})

export default db
