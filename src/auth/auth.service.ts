import {
	ConflictException,
	HttpException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async createUser(authCredDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredDto

		const user = await this.usersRepository.create({
			username,
			password,
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
