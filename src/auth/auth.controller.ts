import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	signUp(@Body() authCredDto: AuthCredentialsDto) {
		return this.authService.signUp(authCredDto)
	}
	@Post('/signin')
	signIn(@Body() authCredDto: AuthCredentialsDto): Promise<string> {
		return this.authService.signIn(authCredDto)
	}
}
