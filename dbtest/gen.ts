import db from "#common/db";
import { authProvider } from "#auth/provider";
if (!process.env.DEV) throw new Error('DEV must be set to true')

const fileHashes = [
	'1a06c32c286411ffc35910fcffd6a4be4ca2a8cb7bdf13c2f595c4f66a81e30b',
	'1e6248e13edb956f554fd5ce6cbf71af882d876a8556cb973bc1a25cde67c077',
	'e078768fa13fa74dc100700fbd2afbbe9d3dff0a5d4d2fe39296cbe0c0b0dc42',
	'7d76297efd799d9c477ab9ab04b7a9ebb460ac6b6ac0dca067b199e8cdc43f82',
	'd91b79b7d5bd8300aff5870d9c65cd75ba327c4f6187be361cd40a31619d01b9',
	'2a627dfe0e3410a25b4fc8ae74406d1f8700dee8c851e08aa8917f0170858111',
	'c8a0e2e18cb1cdae9c42d8c9391919dc4e9d17e581f935cab0e450af11a1b25d',
	'b6d6c05af86bdfb0c6ff2eeb5933ee6dec4930fec761a41eca43bdd623eff029',
	'ed5bde50ea0066e320143256867cfb25a1ea211e7dadbcdf09d8866e7f288102',
	'659ee460e2878f55ff14612ead97c6376a934b73d91f806e0d3aa14879cf017c',
	'8dc6b07d46822a575cb49a281647baf5db90fae65c800eb0cb6fd310379c47f8',
	'ea252360da10d50f7bc2106fd5380f0cf7f4b37d506d462e83b3b3c2f4b09376',
	'470c174ae4dfa88fcda952c90d3d2df67d39837f5e0e385a054f16d2eec35536',
	'e524d362b6e6c4ea7c7e208599b56d9a951442f478b624e8cb355cc898eccb2e',
	'6a0de28c036333e7964fbd8e0043730f388168ce575086af1abae694c125b441'
]
const fileHashesBuf = fileHashes.map(v => Buffer.from(v, 'hex'))

const usersList = ['foo', 'bar', 'baz', 'qux', 'bob', 'jake', 'tom']
const coursesList = ['compbio', 'compphys', 'reseaarch', 'database', 'datastruct', 'algoprog', 'linalg', 'mobile', 'refactoring']
const gradeCompsList = ['mid', 'fin', 'asg', 'quiz', 'lab']

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

async function createUsers() {
	const users = await db.user.findMany({
		select: { id: true, name: true },
		where: { name: { in: usersList } }
	})
	const nonexist = new Set(usersList)
	for (const e of users) nonexist.delete(e.name)
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
	const courses = await db.course.findMany({
		select: { id: true, name: true },
		where: { name: { in: coursesList } }
	})
	const nonexist = new Set(coursesList)
	for (const e of courses) nonexist.delete(e.name)
	if (!nonexist.size) return

	console.log(`Courses to create: ${Array.from(nonexist)}`)
	await db.course.createMany({
		data: Array.from(nonexist, course => ({
			name: course
		}))
	})
}
async function createFiles() {
	const files = await db.file.findMany({
		select: { hash: true },
		where: { hash: { in: fileHashesBuf } }
	})
	const nonexist = new Map(fileHashes.map((v, i) => [v, i]))
	for (const e of files) nonexist.delete(Buffer.from(e.hash).toString('hex'))
	if (!nonexist.size) return

	console.log(`Files to create: ${Array.from(nonexist.values())}`)
	await db.file.createMany({
		data: Array.from(nonexist, ([hash, i]) => ({
			hash: fileHashesBuf[i]!,
			name: 'dummy'+i,
			size: randint(1e5, 1e6)
		}))
	})
}
async function enrollUsersToCourses() {
	const users = await db.user.findMany({
		select: { id: true, name: true },
		where: { name: { in: usersList } }
	})
	const courses = await db.course.findMany({
		select: { id: true, name: true },
		where: { name: { in: Array.from(coursesList) }, users: { none: {} } }
	})
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
	const courses = await db.course.findMany({
		select: {
			id: true, name: true,
			sessions: { select: { sessionNo: true } }
		},
		where: { name: { in: Array.from(coursesList) } }
	})
	courses.sort((a, b) => a.id - b.id)

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
					topic: 'asdjsdfhsifsf',
					location: shuffleArr2('', 10).join(''),
					sessionNo: i,
					courseid: course.id,
					files: { connect: shuffleArr2(fileHashesBuf, randint(0, 3)).map(v => ({hash: v})) }
				}
			})
			waits.push(q)
		}
		if (s.length) console.log(`Creating sessions ${course.name}(${course.id}): ${s}`)
	}
	await Promise.all(waits)
}
async function createGrades() {
	const users = await db.user.findMany({
		select: { id: true, name: true },
		where: { name: { in: usersList } }
	})
	const courses = await db.course.findMany({
		select: {
			id: true, name: true,
			users: { select: { id: true }, where: { name: { in: usersList } } }
		},
		where: { name: { in: Array.from(coursesList) }, gradesComp: { none: {} } }
	})
	const waits = []
	for (const course of courses) {
		const courseUsers = new Set(course.users.map(v => v.id))
		const names = shuffleArr2(gradeCompsList, randint(0, 4))
		console.log(`Creating grades ${course.name}(${course.id}): ${names}`)
		for (const name of names) {
			const q = db.courseGradeComp.create({
				data: {
					name: name,
					courseid: course.id
				}
			}).then(comp => {
				const datas = []
				for (const user of users) {
					// 30% chance for score to be already graded for each user
					if (!(courseUsers.has(user.id) && Math.random() < 0.3)) continue
					datas.push({
						grade: Math.random() * 100,
						compid: comp.id,
						userid: user.id
					})
				}
				return db.courseGrade.createMany({ data: datas })
			})
			waits.push(q)
		}
	}
	await Promise.all(waits)
}

const Cfile = createFiles()
const Cuser = createUsers()
const Ccourse = createCourses()
const Csession = Promise.all([Ccourse, Cfile]).then(createCourseSession)
const Cenroll = Promise.all([Cuser, Ccourse]).then(enrollUsersToCourses)
const Cgrades = Cenroll.then(createGrades)

await Promise.all([Cfile, Cuser, Ccourse, Csession, Cenroll, Cgrades])

db.$disconnect()