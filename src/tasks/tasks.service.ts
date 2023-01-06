import { HttpException, Injectable } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { TaskStatus } from './task.status.enum'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly tasksRepository: Repository<Task>,
	) {}

	async getTasks(filters: GetTasksFilterDto): Promise<Task[]> {
		const { status, search } = filters
		const query = await this.tasksRepository.createQueryBuilder('task')

		if (status) query.andWhere('task.status = :status', { status })
		if (search)
			query.andWhere(
				'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', // LOWER means to lowercase
				{ search: `%${search}%` },
			)

		const tasks = query.getMany()

		return tasks
	}

	async getTaskById(id: string): Promise<Task> {
		const task = await this.tasksRepository.findOne({ where: { id } })
		console.log(task)
		if (!task) throw new HttpException('Task not found', 400)
		return task
	}

	async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
		const { title, description } = createTaskDto

		const task = this.tasksRepository.create({
			title,
			description,
			status: TaskStatus.OPEN,
		})
		await this.tasksRepository.save(task)

		return task
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
		const task = await this.tasksRepository.findOne({ where: { id } })
		task.status = status

		await this.tasksRepository.save(task)
		return task
	}

	async deleteTask(id: string): Promise<void> {
		const deletedTask = await this.tasksRepository.delete(id)

		if (!deletedTask.affected) throw new HttpException('Task not found', 400)
	}
}
