import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WebhookService } from './webhook.service'
import { MessageHandlerFactory } from './eventHandler/MessageHandlerFactory'
import { WebhookController } from './webhook.controller'
import { StorageModule } from 'src/storage/storage.module'
import { LineApiModule } from 'src/lineapi/lineapi.module'
import { GraduateModule } from 'src/graduate/graduate.module'
import { IntentHandlerFactory } from './intentHandler/IntentHandlerFactory'
import { CommandHandlerFactory } from './commandHandler/CommandHandlerFactory'

@Module({
	imports: [PrismaModule, StorageModule, LineApiModule, GraduateModule],
	providers: [
		WebhookService,
		MessageHandlerFactory,
		IntentHandlerFactory,
		CommandHandlerFactory
	],
	controllers: [WebhookController],
	exports: []
})
export class WebhookModule {}
