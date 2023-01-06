import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	getTasks(@Query() filters: GetTasksFilterDto): Promise<Task[]> {
		return this.tasksService.getTasks(filters)
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string): Promise<Task> {
		return this.tasksService.getTaskById(id)
	}

	@Post()
	createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
		return this.tasksService.createTask(createTaskDto)
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() updateTaskStatus: UpdateTaskStatusDto,
	): Promise<Task> {
		const { status } = updateTaskStatus
		return this.tasksService.updateTaskStatus(id, status)
	}

	@Delete('/:id')
	deleteTask(@Param('id') id: string): Promise<void> {
		return this.tasksService.deleteTask(id)
	}
}
