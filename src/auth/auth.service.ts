import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialsDto

		// hash
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(password, salt)

		const user = await this.usersRepository.create({
			username,
			password: hashedPassword,
		})

		try {
			await this.usersRepository.save(user)
		} catch (e) {
			if (e.code === '23505')
				throw new ConflictException('Username already exist')
			//23505 - POSTGRES duplicate error
			else throw new InternalServerErrorException()
		}
	}

	async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
		const { username, password } = authCredentialsDto
		const user = await this.usersRepository.findOne({ where: { username } })
		// test

		if (user && (await bcrypt.compare(password, user.password)))
			return 'success'
		else throw new UnauthorizedException('Please check login credentials')
	}
}
