import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from './task.entity'
import { Exclude } from 'class-transformer'

@Entity('user')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true })
	username: string

	@Column()
	password: string

	@OneToMany(_type => Task, task => task.user, { eager: true })
	tasks: Task[]
}
