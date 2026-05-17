import { JwtModule } from "@nestjs/jwt";
import assert from "assert";

assert(process.env.JWT_SECRET, 'JWT_SECRET not defined')

const AppJwt = JwtModule.register({
	signOptions: {
		expiresIn: '2d',
	},
	secret: process.env.JWT_SECRET,
})

export default AppJwt
