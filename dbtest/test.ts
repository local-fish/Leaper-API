import db from "#common/db";
import { courseProvider } from "#course/provider";
import { courseSessionProvider } from "#coursesession/provider";
import { userProvider as user } from "#user/provider";
if (!process.env.DEV) throw new Error('DEV must be set to true')

function formatUser(user: any) {
	return `[${user.id}] ${user.name} (${user.email}) (${user.role})`
}

function formatCourse(course: any) {
	return `[${course.id}] ${course.name}`
}

console.log('====== USERS ======')
const users = await db.user.findMany({ select: { id: true } })
for (const {id: userid} of users) {
	{
		const userinfo = await user.getInfo(userid)
		if (userinfo) console.log(formatUser(userinfo))
	}
	{
		console.log(`Courses:`)
		const courses = await courseProvider.getCoursesFromUser(userid)
		for (const courseInfo of courses) {
			console.log(' - ' + formatCourse(courseInfo))
			const gradesInfo = await courseProvider.getUserGradesCourse(courseInfo.id, userid)
			console.log('    - scores:', gradesInfo.map(v => `${v.name.padStart(5)}: ${String(v.grade ?? '-').padEnd(3)}`).join('; '))
		}
	}
	console.log()
}

console.log('====== COURSES ======')
const courses = await db.course.findMany({ select: { id: true } })
for (const { id: courseId } of courses) {
	{
		const courseinfo = await courseProvider.getInfo(courseId)
		if (courseinfo) console.log(formatCourse(courseinfo))
	}
	{
		console.log('Students:')
		const courseUsers = await courseProvider.getUsers(courseId)
		for (const user of courseUsers) {
			console.log(' - ' + formatUser(user))
		}
	}
	{
		console.log('Sessions')
		const sessions = await courseSessionProvider.getSessionsFromCourse(courseId)
		for (const session of sessions) {
			console.log(` - [${session.id}] ${session.topic} (${session.startTime.toLocaleString()} - ${session.endTime.toLocaleString()})`)
			console.log('   Materials:')
			const materials = await courseSessionProvider.getSessionMaterials(session.id)
			for (const material of materials) {
				console.log(`    - [${material.hash}] ${material.name.padEnd(10)} (${material.size})`)
			}
		}
	}
	console.log()
}

db.$disconnect()