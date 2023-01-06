import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: 'topSecret51',
			signOptions: {
				expiresIn: 3600,
			},
		}),
		TypeOrmModule.forFeature([User]),
	],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
