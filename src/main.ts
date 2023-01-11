import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, Logger } from '@nestjs/common'
import { TransformInterceptor } from './transform.interceptor'

async function bootstrap() {
	const logger = new Logger()
	const port = 3000
	const app = await NestFactory.create(AppModule)

	app.enableCors()
	app.useGlobalPipes(new ValidationPipe())
	app.useGlobalInterceptors(new TransformInterceptor())
	await app.listen(port)

	logger.log(`Application listening on port ${port}`)
}
bootstrap()
