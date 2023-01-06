import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtPayload } from './jwt-payload.interface'
import { User } from '../../entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {
		super({
			secretOrKey: 'topSecret51',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		})
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { username } = payload
		const user = await this.usersRepository.findOne({
			where: { username },
		})

		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
