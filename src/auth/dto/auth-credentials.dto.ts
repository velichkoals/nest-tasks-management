import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator'

export class AuthCredentialsDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(20)
	username: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(30)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'Passwords must contain at least 1 upper case letter, 1 lower case letter, 1 number or special character',
	})
	password: string
}
