import db from '../common/db'
import { Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

@Injectable()
class UserProvider {
	async getInfo(userId: number): Promise<UserProvider.UserInfo|null> {
		return db.user.findFirst({
			select: { id: true, email: true, name: true, role: true },
			where: { id: userId }
		})
	}
}

namespace UserProvider {
	export class UserInfoHeader {
		@ApiProperty({ type: 'number' })
		declare id: number
		@ApiProperty({ type: 'string' })
		declare name: string
	}
	export class UserInfo extends UserInfoHeader {
		@ApiProperty({ type: 'string' })
		declare email: string
		@ApiProperty({ type: 'string' })
		declare role: string
	}
}

export default UserProvider

export const userProvider = new UserProvider()