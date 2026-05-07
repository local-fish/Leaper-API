import db from '#common/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class UserProvider {
	getInfo(userId: number) {
		return db.user.findFirst({
			select: { id: true, email: true, name: true, role: true },
			where: { id: userId }
		})
	}
}

export const userProvider = new UserProvider()