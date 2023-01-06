import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
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

	async createUser(authCredDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredDto

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
}
