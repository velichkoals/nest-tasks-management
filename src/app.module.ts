import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { Task } from './entities/task.entity'
import { User } from './entities/user.entity'

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
