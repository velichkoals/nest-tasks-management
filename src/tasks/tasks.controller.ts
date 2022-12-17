import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { Task } from './task.model'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	getTasks(@Query() filters: GetTasksFilterDto): Task[] {
		if (Object.keys(filters).length)
			return this.tasksService.getFilteredTasks(filters)

		return this.tasksService.getAllTasks()
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string): Task {
		return this.tasksService.getTaskById(id)
	}

	@Post()
	createTask(@Body() createTaskDto: CreateTaskDto): Task {
		return this.tasksService.createTask(createTaskDto)
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() updateTaskStatus: UpdateTaskStatusDto,
	): Task {
		const { status } = updateTaskStatus
		return this.tasksService.updateTaskStatus(id, status)
	}

	@Delete('/:id')
	deleteTask(@Param('id') id: string): string {
		return this.tasksService.deleteTask(id)
	}
}
