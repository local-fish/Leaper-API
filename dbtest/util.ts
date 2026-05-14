const consonants = 'bcdfghjklmnpqrstvwxyz'

const defaultYapper: Required<YapperOpts> = {
	paragraphSentenceCount: { min: 2, max: 5 },
	sentenceWordCount: { min: 7, max: 14 },
	wordLength: { min: 4, max: 9 }
}

export function yapper(sentenceCount: number, yapperOpts: YapperOpts = defaultYapper) {
	const {
		wordLength: w = defaultYapper.wordLength,
		sentenceWordCount: s = defaultYapper.sentenceWordCount,
		paragraphSentenceCount: p = defaultYapper.paragraphSentenceCount
	} = yapperOpts


	const chunks = []
	let pc = randintr(p)
	for (let i = 0; i < sentenceCount; i++) {
		for (let j = 0; j < randintr(s); j++) {
			if (j != 0) chunks.push(' ')
			const wordLen = randintr(w)
			let word = ''
			for (let i = 0; word.length < wordLen; i++) {
				if (i != 0 || Math.random() < 0.5)
					word += selectRandom('aeiou')
				const cl = randint(1, 3)
				for (let i = 0; i < cl && word.length < wordLen; i++) word += selectRandom(consonants)
			}
			chunks.push(word)
		}
		chunks.push('. ')
		if (--pc <= 0 && i != sentenceCount-1) {
			chunks.push('\n\n')
			pc = randintr(p)
		}
	}
	return chunks.join('')
}

/** Random integer */
export function randint(minIncl: number, maxExcl: number) {
	return minIncl + Math.floor(Math.random() * (maxExcl-minIncl))
}

/** Random integer */
export function randintr(range: Range) {
	return randint(range.min, range.max+1)
}

/** Shuffles array in-place */
export function shuffleArr<T extends any[]>(arr: T, max = arr.length) {
	if (max >= arr.length) max = arr.length-1
	for (let i = 0; i < max; i++) {
		const x = randint(i, arr.length)

		const v = arr[i]
		arr[i] = arr[x]
		arr[x] = v
	}
	return arr
}

/** Selects random elements from an array */
export function selectRandomMulti<T extends any>(arr: Iterable<T>, max?: number | Range) {
	if (typeof max == "object") max = randintr(max)

	let n = shuffleArr(Array.from(arr), max)
	if (max != undefined) n = n.slice(0, max)
	return n
}

/** Selects random element from an array */
export function selectRandom<T extends any>(arr: ArrayLike<T>) {
	return arr[randint(0, arr.length)]
}

/** Generates random string from character set */
export function randstr(length: number, charset = '        abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
	let s = ''
	for (let i = 0; i < length; i++) s += charset[randint(0, charset.length)]
	return s
}

export interface Range {
	/** Inclusive */
	min: number
	/** Inclusive */
	max: number
}

export interface YapperOpts {
	wordLength?: Range
	sentenceWordCount?: Range
	paragraphSentenceCount?: Range
}
