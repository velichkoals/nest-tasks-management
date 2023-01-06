import { HttpException, Injectable } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { TaskStatus } from './task.status.enum'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { Task } from '../entities/task.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly tasksRepository: Repository<Task>,
	) {}

	async getTasks(filters: GetTasksFilterDto, user: User): Promise<Task[]> {
		const { status, search } = filters
		const query = await this.tasksRepository
			.createQueryBuilder('task')
			.where({ user })

		if (status) query.andWhere('task.status = :status', { status })
		if (search)
			query.andWhere(
				'(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', // LOWER means to lowercase
				{ search: `%${search}%` },
			)

		const tasks = query.getMany()

		return tasks
	}

	async getTaskById(id: string, user: User): Promise<Task> {
		const task = await this.tasksRepository.findOne({ where: { id, user } })

		if (!task) throw new HttpException('Task not found', 400)
		return task
	}

	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		const { title, description } = createTaskDto

		const task = this.tasksRepository.create({
			title,
			description,
			status: TaskStatus.OPEN,
			user,
		})
		await this.tasksRepository.save(task)

		return task
	}

	async updateTaskStatus(
		id: string,
		status: TaskStatus,
		user: User,
	): Promise<Task> {
		const task = await this.getTaskById(id, user)
		task.status = status

		await this.tasksRepository.save(task)
		return task
	}

	async deleteTask(id: string, user: User): Promise<void> {
		const deletedTask = await this.tasksRepository.delete({ id, user })

		if (!deletedTask.affected) throw new HttpException('Task not found', 400)
	}
}
