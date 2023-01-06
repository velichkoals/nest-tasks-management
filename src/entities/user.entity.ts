import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from './task.entity'

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: string

	@Column({ unique: true })
	username: string

	@Column()
	password: string

	@OneToMany(_type => Task, task => task.user, { eager: true })
	tasks: Task[]
}
