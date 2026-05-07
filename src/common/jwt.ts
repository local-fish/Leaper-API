import { JwtModule } from "@nestjs/jwt";

const AppJwt = JwtModule.register({
	signOptions: {
		expiresIn: '2d',
	},
	secret: process.env.JWT_SECRET,
})

export default AppJwt
