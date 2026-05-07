import db from "#common/db";
if (!process.env.DEV) throw new Error('DEV must be set to true')


console.log('delete: forumComment')
await db.forumComment.deleteMany(),

console.log('delete: forum')
await db.forum.deleteMany(),

console.log('delete: courseGrade')
await db.courseGrade.deleteMany(),

console.log('delete: courseGradeComp')
await db.courseGradeComp.deleteMany(),

console.log('delete: courseSession')
await db.courseSession.deleteMany(),

console.log('delete: course')
await db.course.deleteMany(),

console.log('delete: user')
await db.user.deleteMany(),

console.log('delete: file')
await db.file.deleteMany(),

db.$disconnect()