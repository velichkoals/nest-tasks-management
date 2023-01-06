import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { TaskStatus } from '../tasks/task.status.enum'
import { Exclude } from 'class-transformer'

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	status: TaskStatus

	@ManyToOne(_type => User, user => user.tasks, { eager: false })
	@Exclude({ toPlainOnly: true })
	user: User
}
