import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

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
}
