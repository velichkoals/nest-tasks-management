import { HttpException, Injectable } from '@nestjs/common'
import { Task, TaskStatus } from './task.model'
import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Injectable()
export class TasksService {
	private tasks: Task[] = []
	getAllTasks(): Task[] {
		return this.tasks
	}
	getFilteredTasks(filters: GetTasksFilterDto): Task[] {
		const { status, search } = filters
		let tasks = this.getAllTasks()

		if (status) tasks = tasks.filter(task => task.status === status)

		if (search)
			tasks = tasks.filter(
				task =>
					task.title.toLowerCase().includes(search.toLowerCase()) ||
					task.description.toLowerCase().includes(search.toLowerCase()),
			)

		return tasks
	}
	getTaskById(id: string): Task {
		const task = this.tasks.find(task => task.id === id)

		if (!task) throw new HttpException('Task not found', 400)

		return task
	}

	createTask(createTaskDto: CreateTaskDto): Task {
		const { title, description } = createTaskDto

		const task: Task = {
			id: uuid(),
			title,
			description,
			status: TaskStatus.OPEN,
		}
		this.tasks.push(task)

		return task
	}

	updateTaskStatus(id: string, status: TaskStatus): Task {
		const task = this.getTaskById(id)
		task.status = status

		return task
	}

	deleteTask(id: string): string {
		const taskToDelete = this.tasks.filter(task => task.id !== id)

		if (!taskToDelete.length) throw new HttpException('Task not found', 400)
		this.tasks = taskToDelete

		return id
	}
}
