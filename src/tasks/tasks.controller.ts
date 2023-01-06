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
import { AuthGuard } from '@nestjs/passport'
import { Task } from '../entities/task.entity'
import { User } from '../entities/user.entity'
import { GetUser } from '../auth/decorators/get-user.decorator'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	getTasks(
		@Query() filters: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		return this.tasksService.getTasks(filters, user)
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
		return this.tasksService.getTaskById(id, user)
	}

	@Post()
	createTask(
		@Body() createTaskDto: CreateTaskDto,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.createTask(createTaskDto, user)
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() updateTaskStatus: UpdateTaskStatusDto,
		@GetUser() user: User,
	): Promise<Task> {
		const { status } = updateTaskStatus
		return this.tasksService.updateTaskStatus(id, status, user)
	}

	@Delete('/:id')
	deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
		return this.tasksService.deleteTask(id, user)
	}
}
