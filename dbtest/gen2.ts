import { ForumCreateManyCourseInput, UserCreateManyInput } from "../prisma/generated/models";
import { authProvider } from "../src/auth/provider";
import * as util from "./util"
import db from "../src/common/db";
import { fileProvider } from "../src/file/provider";
if (!process.env.DEV) throw new Error('DEV must be set to true')

const usersGen: [id: number, username: string, password: string][] = [
	[9900, 'andrew'   , 'fish'    ],
	[9901, 'evankim'  , 'pork'    ],
	[9902, 'tommylim' , 'tommylim'],
	[9903, 'calvin'   , 'calvin'  ],
	[9904, 'alex'     , 'alex'    ],
	[9905, 'thomas'   , 'thomas'  ],
	[9906, 'kenneth'  , 'kenneth' ],
	[9907, 'abel'     , 'abel'    ],
	[9908, 'jonathan' , 'dummy123'],
	[9909, 'charlie'  , 'dummy123'],
	[9910, 'joe'      , 'joe'     ],
	[9911, 'henry'    , 'henry'   ],
	[9912, 'jimmy'    , 'jimmy'   ],
	[9913, 'foo'      , 'foo'     ],
	[9999, 'system'   , 'system'  ],
]

const filesGen: [id: string, uid: number, name: string, content: string][] = [
	['x1', 9999, '1byte.txt', 'a'],
	['x2', 9999, '1kb.txt', 'a'.repeat(1024)],
	['x3', 9999, '1mb.txt', 'a'.repeat(1048576)],
	['x4', 9999, 'not_a_ppt.ppt', 'YOU FOOL'],
	['x5', 9999, 'not_a_doc.doc', 'YOU FOOL'],
	['x6', 9999, 'not_a_zip.zip', 'YOU FOOL'],
	['x7', 9999, 'not_a_image.png', 'YOU FOOL'],
	['x8', 9999, 'not_a_image.jpg', 'YOU FOOL'],
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
		sessions: ['Introduction to Chemistry', 'Acid and Base', 'Molecule', 'Compound', 'IUPAC', 'Electrolysis', 'Chemical Reaction', 'Colligative Properties', 'Colloid', 'Oxidation', 'Reuction']
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
		sessions: ['Introduction to Software Engineering', 'AGILE', 'SCRUM', 'Requirement Engineering', 'Requirement Modeling and UML', 'Software Design Principles', 'Project Management', 'Project Scheduling', 'Risk Analysis', 'SCM', 'Version Control System', 'Reliability Engineering', 'Software Testing', 'Sotware Maintenance', 'DevOps']
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

		commentChance: 0.5,
		commentBodySentences: { min: 1, max: 8 },
		replyChance: 0.4,
	}
}

async function createUsers() {
	await db.user.createMany({
		data: usersGen.map(([id, name, pass]): UserCreateManyInput => ({
			name: name,
			email: name + '@example.com',
			role: 'Student',
			id: id,
			pwhash: authProvider.hashPassword(name, pass),
		}))
	})
}

async function createFiles() {
	await Promise.all(filesGen.map(([id, uid, name, content]) => fileProvider.put(uid, name, content, id)))
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

function mapForumParam(title: string, userids: number[]): ForumCreateManyCourseInput {
	return {
		body: util.yapper(util.randintr(forumGen.config.bodySentences)),
		time: new Date(Date.now() + Math.random() * 14 * 86400000),
		title: title,
		userId: util.selectRandom(userids)
	}
}

async function commentForum(forumId: number, ids: number[], chance: number, parentId?: number) {
	const replying = ids.filter(() => Math.random() < chance)

	await db.forumComment.createMany({
		data: replying.map(userid => ({
			body: util.yapper(util.randintr(forumGen.config.commentBodySentences)),
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
	const courseLecs = util.selectRandomMulti(courseUsers, courseGen.config.lecturers)
	const courseStudents = Array.from(new Set(courseUsers).difference(new Set(courseLecs)))

	let sessionStart = Date.now() + Math.random() * 28 * 86400000

	const gen = await db.course.create({
		select: {
			gradesComp: { select: { id: true } },
			forums: { select: { id: true } },
			sessions: { select: { id: true } }
		},
		data: {
			name: name,
			users: { connect: courseUsers.map(id => ({id})) },
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
						util.selectRandomMulti(forumGen.lecForumTitle, forumGen.config.lecForums).map(title => mapForumParam(title, courseLecs)),
						util.selectRandomMulti(forumGen.forumTitle, forumGen.config.studentForums).map(title => mapForumParam(title, courseStudents)),
					)
				}
			},
			sessions: {
				createMany: {
					data: sessions.map((name, i) => {
						const dur = util.randintr(courseGen.config.sessionDurationHours) * 3600000
						const gap = util.randintr(courseGen.config.sessionGapHours) * 3600000
						const startTime = sessionStart
						const endTime = sessionStart + dur
						sessionStart += gap

						return {
							startTime: new Date(startTime),
							endTime: new Date(endTime),
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
const c = Promise.all([a, b]).then(createCourses)

await Promise.all([a, b, c])

db.$disconnect()
