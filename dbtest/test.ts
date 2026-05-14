import db from "../src/common/db";
import { courseProvider } from "../src/course/provider";
import { forumProvider } from "../src/forum/provider";
import { userProvider as user } from "../src/user/provider";
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
			console.log('    - scores:', gradesInfo.map(v => `${v.component.padStart(5)}: ${String(v.grade ?? '-').padEnd(3)}`).join('; '))
		}
	}
	console.log()
}

async function forumComments(forumId: number, parentId: number | null | undefined = null, depth = 1) {
	const stack = ' . '.repeat(depth)
	const comments = await forumProvider.getComments(forumId, parentId)
	for (const comment of comments) {
		console.log(stack + ` -> [${comment.id}] [${comment.user.id}] ${comment.user.name}`)
		await forumComments(forumId, comment.id, depth + 1)
	}
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
		const sessions = await courseProvider.getSessions(courseId)
		for (const session of sessions) {
			console.log(` - [${session.id}] ${session.topic} (${session.startTime.toLocaleString()} - ${session.endTime.toLocaleString()})`)
			console.log('   Materials:')
			const materials = await courseProvider.getSessionMaterials(session.id)
			for (const material of materials) {
				console.log(`    - [${material.id}] ${material.name.padEnd(10)} (${material.size})`)
			}
		}
	}
	{
		console.log('Forums')
		const forums = await forumProvider.getForumsFromCourse(courseId)
		for (const forum of forums) {
			console.log(` - [${forum.id}] ${forum.title} (by [${forum.user.id}] ${forum.user.name})`)
			await forumComments(forum.id)
		}
	}
	console.log()
}

db.$disconnect()
