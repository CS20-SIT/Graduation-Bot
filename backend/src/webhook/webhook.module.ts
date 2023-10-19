import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WebhookService } from './webhook.service'
import { MessageHandlerFactory } from './eventHandler/MessageHandlerFactory'
import { WebhookController } from './webhook.controller'
import { StorageModule } from 'src/storage/storage.module'
import { LineApiModule } from 'src/lineapi/lineapi.module'
import { GraduateModule } from 'src/graduate/graduate.module'

@Module({
	imports: [PrismaModule, StorageModule, LineApiModule, GraduateModule],
	providers: [WebhookService, MessageHandlerFactory],
	controllers: [WebhookController],
	exports: []
})
export class WebhookModule {}
