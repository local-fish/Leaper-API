import db from "../src/common/db";
import { authProvider } from "../src/auth/provider";
import { Prisma } from "../prisma/generated/client";
if (!process.env.DEV) throw new Error('DEV must be set to true')

const fileNames = [
	'aaaaa',
	'bbbbb',
	'ccc',
	'dd',
	'gg',
	'ee',
	'hh',
	'ffasada',
	'jj',
	'uu',
	'eyhe',
	'ii',
	'jrthth',
	'fafewrwqr',
	'dfdgghrh'
]

const usersList = ['Bob', 'Jake', 'Tom', 'john', 'kimmy', 'thomas', 'kenneth', 'abel', 'tommy', 'andrew', 'evan', 'charlie']
const coursesList = ['Biology', 'Physics', 'Chemistry', 'Database', 'Data Structures', 'Algorithms and Programming', 'Linear Algebra', 'Mobile Programming', 'Refactoring']
const gradeCompsList = ['Midterm', 'Final', 'Assignment', 'Quiz', 'Lab']

function randint(min: number, max: number) {
	return min + Math.floor(Math.random() * (max-min))
}

function shuffleArr<T extends any[]>(arr: T, max = arr.length) {
	if (max >= arr.length) max = arr.length-1
	for (let i = 0; i < max; i++) {
		const x = randint(i, arr.length)

		const v = arr[i]
		arr[i] = arr[x]
		arr[x] = v
	}
	return arr
}

function shuffleArr2<T extends any>(arr: Iterable<T>, max?: number) {
	let n = shuffleArr(Array.from(arr), max)
	if (max != undefined) n = n.slice(0, max)
	return n
}

function randstr(length: number, charset = '        abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
	let s = ''
	for (let i = 0; i < length; i++) s += charset[randint(0, charset.length)]
	return s
}

async function getUsers(select?: Prisma.UserSelect, where?: Prisma.UserWhereInput) {
	return await db.user.findMany({
		select: { id: true, name: true, ...select },
		where: { name: { in: usersList }, ...where }
	})
}

async function getCourses(select?: Prisma.CourseSelect, where?: Prisma.CourseWhereInput, users = false) {
	return await db.course.findMany({
		select: {
			id: true,
			name: true,
			users: users ? { select: { id: true, name: true }, where: { name: { in: usersList } } } : undefined,
			...select
		},
		where: { name: { in: Array.from(coursesList) }, ...where }
	})
}

async function createUsers() {
	const users = await getUsers()
	const nonexist = new Set(usersList).difference(new Set(users.map(v => v.name)))
	if (!nonexist.size) return

	console.log(`Users to create: ${Array.from(nonexist)}`)
	await db.user.createMany({
		data: Array.from(nonexist, user => ({
			name: user,
			email: user + '@example.com',
			pwhash: authProvider.hashPassword(user, user),
			role: 'Student'
		}))
	})
}
async function createCourses() {
	const courses = await getCourses()
	const nonexist = new Set(coursesList).difference(new Set(courses.map(v => v.name)))
	if (!nonexist.size) return

	console.log(`Courses to create: ${Array.from(nonexist)}`)
	await db.course.createMany({
		data: Array.from(nonexist, course => ({
			name: course
		}))
	})
}
async function createFiles() {
	const users = await getUsers()

	const files = await db.file.findMany({
		select: { id: true },
		where: { id: { in: fileNames } }
	})
	const nonexist = new Set(fileNames).difference(new Set(files))

	console.log(`Files to create: ${Array.from(nonexist.values())}`)
	await db.file.createMany({
		data: Array.from(nonexist, (name, i) => ({
			id: name,
			name: 'dummy'+i,
			size: randint(1e5, 1e6),
			gcCluster: 0,
			userId: shuffleArr2(users, 1)[0].id
		}))
	})
}
async function enrollUsersToCourses() {
	const users = await getUsers()
	const courses = await getCourses({}, { users: { none: {} }})
	const waits = []
	for (const course of courses) {
		const enrolls = []
		for (const user of users) {
			if (!(Math.random() < 0.5)) continue

			const q = db.course.update({
				data: { users: { connect: { id: user.id } } },
				where: { id: course.id }
			})
			enrolls.push(user.name)
			waits.push(q)
		}
		console.log(`Enroll ${course.name}(${course.id}): ${enrolls}`)
	}
	await Promise.all(waits)
}
async function createCourseSession() {
	const courses = await getCourses({ sessions: { select: { sessionNo: true } } })
	const waits = []
	for (const course of courses) {
		let dateStart = new Date(Date.now() + ((Math.random() - 0.5) * 14*24*60*60*1000))

		const existingSes = new Set(course.sessions.map(v => v.sessionNo))
		const s = []
		for (let i = 1; i <= 8; i++) {
			if (existingSes.has(i)) continue
			dateStart.setDate(dateStart.getDate() + 4)
			s.push(i)
			const q = db.courseSession.create({
				data: {
					startTime: new Date(dateStart),
					endTime: new Date(dateStart.getTime() + 60*60*1000*5),
					topic: randstr(10),
					location: randstr(10),
					sessionNo: i,
					courseId: course.id,
					files: { connect: shuffleArr2(fileNames, randint(0, 3)).map(v => ({id: v})) }
				}
			})
			waits.push(q)
		}
		if (s.length) console.log(`Creating sessions ${course.name}(${course.id}): ${s}`)
	}
	await Promise.all(waits)
}
async function createGrades() {
	const courses = await getCourses({}, { gradesComp: { none: {} } }, true)
	const waits = []
	for (const course of courses) {
		const names = shuffleArr2(gradeCompsList, randint(1, 4))

		console.log(`Creating grades ${course.name}(${course.id}): ${names}`)
		for (const name of names) {
			const q = db.courseGradeComp.create({
				data: {
					name: name,
					courseId: course.id
				}
			}).then(comp => {
				const datas = []
				for (const user of course.users) {
					// 70% chance for score to be already graded for each user
					if (!(Math.random() < 0.7)) continue
					datas.push({
						grade: Math.random() * 100,
						compid: comp.id,
						userId: user.id
					})
				}
				return db.courseGrade.createMany({ data: datas })
			})
			waits.push(q)
		}
	}
	await Promise.all(waits)
}
interface CommentForumInfo {
	forumId: number
	users: number[]
	successFactor: number
}

async function commentForum(info: CommentForumInfo, chance: number, parent?: number) {
	const waits = []
	for (const user of info.users) {
		if (!(Math.random() < chance)) continue
		const q = db.forumComment.create({
			data: {
				body: randstr(randint(20, 80)),
				time: new Date(),
				forumId: info.forumId,
				userId: user,
				parentId: parent
			}
		}).then(comment =>
			commentForum(info, chance * info.successFactor, comment.id)
		)
		waits.push(q)
	}
	await Promise.all(waits)
}
async function createForums() {
	const courses = await getCourses({}, { forums: { none: {} } }, true)
	const waits = []
	for (const course of courses) {
		const userIds = course.users.map(v => v.id)
		// select half users on a course
		const usersCreating = shuffleArr2(course.users, Math.ceil(course.users.length / 2))
		for (const user of usersCreating) {
			console.log(`Creating forum ${course.name}(${course.id}) - ${user.name}(${user.id})`)
			const q = db.forum.create({
				data: {
					title: randstr(15),
					body: randstr(randint(200, 600)),
					time: new Date(),
					userId: user.id,
					courseId: course.id
				}
			}).then(forum =>
				commentForum({
					forumId: forum.id,
					users: userIds,
					successFactor: 0.4
				}, 0.8)
			)
			waits.push(q)
		}
	}
	await Promise.all(waits)
}

const Cuser = createUsers()
const Cfile = Cuser.then(createFiles)
const Ccourse = createCourses()
const Csession = Promise.all([Ccourse, Cfile]).then(createCourseSession)
const Cenroll = Promise.all([Cuser, Ccourse]).then(enrollUsersToCourses)
const Cgrades = Cenroll.then(createGrades)
const Cforums = Cenroll.then(createForums)

await Promise.all([Cfile, Cuser, Ccourse, Csession, Cenroll, Cgrades, Cforums])

db.$disconnect()
