import db from "../src/common/db";
if (!process.env.DEV) throw new Error('DEV must be set to true')

console.log('delete: course')
await db.course.deleteMany(),

console.log('delete: user')
await db.user.deleteMany(),

db.$disconnect()