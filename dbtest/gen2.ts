import { ForumCreateManyCourseInput, UserCreateManyInput } from "../prisma/generated/models";
import { authProvider } from "../src/auth/provider";
import * as util from "./util"
import db from "../src/common/db";
if (!process.env.DEV) throw new Error('DEV must be set to true')

const usersGen: [id: number, username: string, password: string][] = [
	[9900, 'Andrew P' , 'fish'    ],
	[9901, 'Evan K'   , 'pork'    ],
	[9902, 'Tommy'    , 'tommylim'],
	[9903, 'Calvin Chan', 'calvin'  ],
	[9904, 'Alex G'   , 'alex'    ],
	[9905, 'Thomas'   , 'thomas'  ],
	[9906, 'Kenneth'  , 'kenneth' ],
	[9907, 'Abel'     , 'abel'    ],
	[9908, 'Jonathan E', 'dummy123'],
	[9909, 'Charlie R', 'dummy123'],
	[9910, 'Joe P'    , 'joe'     ],
	[9911, 'Henry L'  , 'henry'   ],
	[9912, 'Jimmy C'  , 'jimmy'   ],
	[9913, 'foo'      , 'foo'     ],
	[9999, 'system'   , 'system'  ],
]

const lecturersGen: [id: number, username: string, password: string][] = [
	[8900, 'John'     , 'john'    ],
	[8901, 'Charles'  , 'charles' ],
	[8902, 'Matthew W', 'matthew' ]
]

const filesGen: [id: string, uid: number, name: string, content: string][] = [
	['x1', 8900, '1byte.txt', 'a'],
	['x2', 8900, '1kb.txt', 'a'.repeat(1024)],
	['x3', 8900, '1mb.txt', 'a'.repeat(1048576)],
	['x4', 8900, 'not_a_ppt.ppt', 'YOU FOOL'],
	['x5', 8900, 'not_a_doc.doc', 'YOU FOOL'],
	['x6', 8900, 'not_a_zip.zip', 'YOU FOOL'],
	['x7', 8900, 'not_a_image.png', 'YOU FOOL'],
	['x8', 8900, 'not_a_image.jpg', 'YOU FOOL'],
]

const courseGen = {
	courses: [{
		name: 'Computational Biology',
		sessions: ['Introduction to Computational Biology', 'Genomics', 'Proteomics', 'DNA sequencing', 'DNA mutation', 'Bioinformatics', 'Sequence Alignment', 'Molecular Evolution']
	}, {
		name: 'Computational Physics',
		sessions: ['Introduction to Computational Physics', 'Electric Charge', 'Voltage', 'Current', 'Resistance', 'Capacitance', 'Circuit', 'Magnetic Fields', 'Induction and Inductance']
	}, {
		name: 'Chemistry',
		sessions: ['Introduction to Chemistry', 'Acid and Base', 'Molecule', 'Compound', 'IUPAC', 'Electrolysis', 'Chemical Reaction', 'Colligative Properties', 'Colloid', 'Oxidation', 'Reduction']
	}, {
		name: 'Database',
		sessions: ['Introduction to Database', 'Relational Model', 'Relational Algebra', 'Relational Calculus', 'Schema Refinement', 'Normal Forms', 'SQL', 'Advanced SQL', 'Transaction', 'Concurrency']
	}, {
		name: 'Data Structures',
		sessions: ['Introduction to Data Structures', 'Linked List', 'Hash Map', 'Binary Tree', 'B-Tree', 'Red Black Tree', 'AVL Tree', 'Heaps', 'Graphs']
	}, {
		name: 'Algorithm and Programming',
		sessions: ['Introduction to Algorithm', 'Operator, Operand, Arithmetic', 'Pointer and Array', 'Functions', 'Recursions', 'Structures', 'Memory Allocation', 'File Processing', 'Sorting', 'Searching']
	}, {
		name: 'Theory of Computation',
		sessions: ['Introduction to Theory of Computation', 'Automata Theory', 'Formal Proof', 'Inductive Proof', 'Central Concepts of Automata Theory', 'Finite Automata', 'DFA', 'NDFA', 'Regular Expressions', 'Context Free Grammars', 'Pushdown Automata', 'Undecidability', 'P and NP']
	}, {
		name: 'Linear Algebra',
		sessions: ['System of Linear Equations', 'Matrix', 'Vector', 'Eigenvalues and Eigenvectors', 'Linear Transformation']
	}, {
		name: 'Mobile Programming',
		sessions: ['Introduction to Mobile Rendering', 'Flutter', 'Widget', 'Stateful Widget', 'Interaction Design', 'App Navigation', 'Media and Assets', 'Web service and API usage', 'Deployment', 'Publishing']
	}, {
		name: 'Refactoring',
		sessions: ['Introduction to Refactoring & Bad Code Smell', 'The Bloaters', 'The OOP Abuser', 'The Change Preventer', 'The Dispensable', 'The Couplers', 'OOP Smell', 'Abstraction Smell', 'Encapsulation Smell', 'Modularization Smell', 'Hierarchy Smell']
	}, {
		name: 'Software Engineering',
		sessions: ['Introduction to Software Engineering', 'AGILE', 'SCRUM', 'Requirement Engineering', 'Requirement Modeling and UML', 'Software Design Principles', 'Project Management', 'Project Scheduling', 'Risk Analysis', 'SCM', 'Version Control System', 'Reliability Engineering', 'Software Testing', 'Software Maintenance', 'DevOps']
	}, {
		name: 'Software Architecture',
		sessions: ['OOP & SOLID', 'Design Patterns', 'Creational Patterns', 'Structural Pattern', 'behavioral Pattern', 'Software Architecture', 'Layered & Monolithic Architecture', 'Microservices', 'Microkernel']
	}],
	gradeComponentNames: ['Final', 'Mid', 'Assignment', 'Lab', 'Quiz'],
	locations: ['A', 'B', 'C', 'D'].flatMap(building => Array.from(Array(20), (v,room) => building + (101 + room))),
	config: {
		users: { min: 4, max: 8 },
		lecturers: { min: 1, max: 2 },
		gradeComp: { min: 2, max: 8 },
		gradedStudents: { min: 2, max: 8 },
		gradeRange: { min: 10, max: 100 },
		sessionDurationHours: { min: 1, max: 5 },
		sessionGapHours: { min: 48, max: 168 },
		sessionMaterials: { min: 0, max: 5 },
	}
}
const forumGen = {
	forumTitle: ['Help', 'Question', 'WA Group', 'Attendance', 'Test'],
	lecForumTitle: ['Assignment', 'Presentation', 'Video Assignment', 'Announcement', 'Task', 'Exercise', 'Material', 'Line Group', 'Exam Briefing'],
	config: {
		studentForums: { min: 2, max: 4 },
		lecForums: { min: 3, max: 5 },
		bodySentences: { min: 3, max: 15 },

		commentChance: 0.3,
		commentBodySentences: { min: 1, max: 8 },
		replyChance: 0.25,
	}
}

const studentForumBodies = [
	"Does anyone know what's going to be covered in the next session? I want to prepare in advance.",
	"Can someone explain the difference between the two approaches discussed in class? I keep getting confused.",
	"I'm having trouble with this week's assignment. Has anyone else run into the same issue?",
	"When is the deadline for the lab submission? I can't find it anywhere on the portal.",
	"Is the exam going to cover everything from the beginning of the semester or just the recent sessions?",
	"Does anyone have notes from last session? I had to miss it due to a family matter.",
	"I don't understand the last part of the lecture. The explanation went a bit fast. Can someone help?",
	"Has anyone started on the group project yet? We should probably organize a meeting this week.",
	"Quick question — are we allowed to use external libraries for the assignment or only the ones from class?",
	"Just wanted to share a resource I found that explains this topic really well. Hope it helps everyone.",
	"Is office hours still happening this week or was it moved? I need to ask about my grade.",
	"How many pages is the report supposed to be? The brief wasn't very clear on that.",
	"Anyone else finding this topic particularly difficult? I've read the slides three times and still lost.",
	"Do we need to submit individually or as a group? The assignment sheet says both things in different places.",
	"Gentle reminder that our group presentation is next week — let's finalize the slides by Thursday.",
]

const lecturerForumBodies = [
	"Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.",
	"The exam will cover sessions 1 through 6. Please review your notes and the provided reading materials.",
	"Reminder: attendance is mandatory for next week's session. Please inform me in advance if you cannot attend.",
	"The lecture material for this week has been uploaded to the portal. Please review it before class.",
	"Office hours this week will be moved to Thursday 2–4pm. Please plan accordingly.",
	"A correction to the formula discussed in today's session has been posted. Please update your notes.",
	"The group project rubric has been updated. Please re-read it carefully before your final submission.",
	"Results for the midterm exam will be released by end of this week. Check the grades section.",
	"Next session will include a short quiz covering the last three topics. No calculators allowed.",
	"Please form your groups for the final project by Friday and submit the group member list via this forum.",
	"There will be a guest lecture next week. Attendance will be recorded and counts toward participation.",
	"The assignment deadline has been extended by two days due to the public holiday. New deadline is Friday 11:59pm.",
	"Please ensure your submissions are in the correct format. Incorrectly formatted files will not be graded.",
	"A recap of today's session has been uploaded. It covers the points that were most commonly misunderstood.",
	"Reminder to complete the course evaluation form. Your feedback helps improve the course for future students.",
]

const studentCommentBodies = [
	"Thanks, this really helped!",
	"I had the same question, glad someone asked.",
	"I think the deadline is on the course schedule page.",
	"Same issue here. I ended up just emailing the lecturer.",
	"I can share my notes, give me a moment to upload them.",
	"Pretty sure it covers everything. Better safe than sorry.",
	"I found a YouTube video that explains this really well, let me find the link.",
	"We should make a group chat for this. Anyone have everyone's contact?",
	"I think external libraries are fine as long as you cite them.",
	"This is really helpful, bookmarking this.",
	"I asked during office hours and the answer is yes, individual submission.",
	"Thanks for the reminder! I almost forgot about the presentation.",
	"I failed to understand that part too. Going to office hours tomorrow.",
	"The slides are actually on the portal under session materials.",
	"Can confirm, the formula correction is important. I got the wrong answer without it.",
]

function randomBody(pool: string[]): string {
	return pool[Math.floor(Math.random() * pool.length)]
}

function createUserParam(id: number, name: string, pass: string, role: string): UserCreateManyInput {
	const email = name.split(" ").join(".").toLowerCase() + '@example.com'
	return {
		name: name,
		email: email,
		role: role,
		id: id,
		pwhash: authProvider.hashPassword(email, pass),
	}
}

async function createUsers() {
	const u = usersGen.map(([id, name, pass]) => createUserParam(id, name, pass, 'Student'))
	const l = lecturersGen.map(([id, name, pass]) => createUserParam(id, name, pass, 'Teacher'))

	await db.user.createMany({ data: u.concat(l) })
}

async function createFiles() {
	if (process.env.S3_ACCESS_SECRET && !process.env.S3_DEV_NOGEN) {
		const { fileProvider } = await import("../src/file/provider");
		await Promise.all(filesGen.map(([key, userId, name, stream]) => fileProvider.put({ key, userId, name, stream })))
	} else {
		console.log('Skipping creating files to bucket')
		await db.file.createMany({
			data: filesGen.map(([id, userId, name, {length: size}]) => ({ gcCluster: 1, id, name, userId, size }))
		})
	}
}

async function createCourseGrade(id: number, courseStudents: number[]) {
	const {config} = courseGen
	return db.courseGrade.createMany({
		data: util.selectRandomMulti(courseStudents, config.gradedStudents).map(stuid => ({
			grade: util.randint(config.gradeRange.min, config.gradeRange.max),
			userId: stuid,
			compid: id
		}))
	})
}

function mapForumParam(title: string, userids: number[], isLecturer: boolean): ForumCreateManyCourseInput {
	return {
		body: randomBody(isLecturer ? lecturerForumBodies : studentForumBodies),
		time: new Date(Date.now() + Math.random() * 14 * 86400000),
		title: title,
		userId: util.selectRandom(userids)
	}
}

async function commentForum(forumId: number, ids: number[], chance: number, parentId?: number) {
	const replying = ids.filter(() => Math.random() < chance)

	await db.forumComment.createMany({
		data: replying.map(userid => ({
			body: randomBody(studentCommentBodies),
			time: new Date(Date.now() + Math.random() * 14 * 86400000),
			userId: userid,
			forumId: forumId,
			parentId: parentId
		}))
	})
	const generateds = await db.forumComment.findMany({ select: { id: true }, where: { forumId: forumId, parentId: parentId ?? null } })

	await Promise.all( generateds.map(({id}) => commentForum(forumId, ids, chance * forumGen.config.replyChance, id)) )
}

async function addSessionMaterials(id: number) {
	const materials = util.selectRandomMulti(filesGen, courseGen.config.sessionMaterials).map(([id]) => ({id}))

	await db.courseSession.update({
		data: { files: { connect: materials } },
		where: { id: id }
	})
}

async function createCourse(name: string, sessions: string[]) {
	const courseUsers = util.selectRandomMulti(usersGen, courseGen.config.users).map(v => v[0])
	const courseLecs = util.selectRandomMulti(lecturersGen, courseGen.config.lecturers).map(v => v[0])
	const courseStudents = Array.from(new Set(courseUsers).difference(new Set(courseLecs)))

	let sessionStart = new Date(Date.now() + Math.random() * 28 * 86400000)

	const gen = await db.course.create({
		select: {
			gradesComp: { select: { id: true } },
			forums: { select: { id: true, userId: true } },
			sessions: { select: { id: true } }
		},
		data: {
			name: name,
			students: { connect: courseUsers.map(id => ({id})) },
			users: { connect: courseUsers.concat(courseLecs).map(id => ({id})) },
			lecturers: { connect: courseLecs.map(id => ({id})) },

			gradesComp: {
				createMany: {
					data: util.selectRandomMulti(courseGen.gradeComponentNames, courseGen.config.gradeComp).map(name => ({
						name
					}))
				}
			},
			forums: {
				createMany: {
					data: Array<ForumCreateManyCourseInput>().concat(
						util.selectRandomMulti(forumGen.lecForumTitle, forumGen.config.lecForums).map(title => mapForumParam(title, courseLecs, true)),
						util.selectRandomMulti(forumGen.forumTitle, forumGen.config.studentForums).map(title => mapForumParam(title, courseStudents, false)),
					)
				}
			},
			sessions: {
				createMany: {
					data: sessions.map((name, i) => {
						const dur = util.randintr(courseGen.config.sessionDurationHours) * 3600000
						const gap = util.randintr(courseGen.config.sessionGapHours) * 3600000
						const startTime = new Date(sessionStart)
						if (startTime.getDay() == 0) startTime.setDate(startTime.getDate()+1)

						const endTime = new Date(sessionStart.getTime() + dur)
						sessionStart.setTime(sessionStart.getTime() + gap)

						return {
							startTime: startTime,
							endTime: endTime,
							sessionNo: i+1,
							topic: name,
							location: util.selectRandom(courseGen.locations)
						}
					})
				}
			}
		}
	})
	await Promise.all([
		Promise.all( gen.gradesComp.map(({id}) => createCourseGrade(id, courseStudents)) ),
		Promise.all( gen.forums.map(({id}) => commentForum(id, courseUsers, forumGen.config.commentChance)) ),
		Promise.all( gen.sessions.map(({id}) => addSessionMaterials(id)) ),
	])
}

async function createCourses() {
	await Promise.all( courseGen.courses.map(v => createCourse(v.name, v.sessions)) )
}

const a = await createUsers()
const b = await createFiles()
await Promise.all([a, b])
await createCourses()

db.$disconnect()
