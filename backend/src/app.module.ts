import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraduateModule } from './graduate/graduate.module'
import { LineApiModule } from './lineapi/lineapi.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaModule } from './prisma/prisma.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WebhookModule } from './webhook/webhook.module'

@Module({
	imports: [
		GraduateModule,
		LineApiModule,
		PrismaModule,
		WebhookModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '/config/.env']
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client')
		})
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
	exports: [PrismaService]
})
export class AppModule {}
