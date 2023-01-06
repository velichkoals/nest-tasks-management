import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: string

	@Column({ unique: true })
	username: string

	@Column()
	password: string
}
