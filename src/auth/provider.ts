import db from '../common/db'
import UserProvider from '../user/provider'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import crypto from 'crypto'
import assert from 'assert'

assert(process.env.PASSWORD_SECRET, 'PASSWORD_SECRET not defined')

const secretConst = 'J8rnlOZIRw7ruly_'

@Injectable()
export default class AuthProvider {
	constructor(
		private userSvc: UserProvider,
		private jwtSvc: JwtService,
	) {}

	hashPassword(username: string, password: string) {
		return crypto.createHmac('sha256', process.env.PASSWORD_SECRET!).update(password + username + secretConst).digest()
	}

	async getIdentifier(username: string, password: string) {
		const hashedpw = this.hashPassword(username, password)
		const res = await db.user.findFirst({
			select: { id: true },
			where: { name: username, pwhash: hashedpw }
		})
		return res?.id
	}

	async generateKey(userId: number) {
		const info = await this.userSvc.getInfo(userId)
		if (!info) return null

		return this.jwtSvc.signAsync({ userId: info.id, userRole: info.role })
	}
}

export const authProvider = new AuthProvider(new UserProvider(), new JwtService())
