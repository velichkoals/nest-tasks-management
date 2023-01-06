import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './tasks/task.entity'
import { User } from './auth/user.entity'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		TasksModule,
		AuthModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'task-management',
			autoLoadEntities: true,
			synchronize: true,
			entities: [Task, User],
		}),
	],
})
export class AppModule {}
