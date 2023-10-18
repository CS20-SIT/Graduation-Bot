import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WebhookService } from './webhook.service'
import { MessageHandlerFactory } from './eventHandler/MessageHandlerFactory'
import { WebhookController } from './webhook.controller'

@Module({
	imports: [PrismaModule],
	providers: [WebhookService, MessageHandlerFactory],
	controllers: [WebhookController],
	exports: []
})
export class WebhookModule {}
