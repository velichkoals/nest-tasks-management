import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt-strategy'
import { User } from '../entities/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: 3600,
				},
			}),
		}),
		TypeOrmModule.forFeature([User]),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
	exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
