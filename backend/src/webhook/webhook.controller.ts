import { Body, Controller, Logger, Post } from '@nestjs/common'
import { EventType, WebhookRequestDto } from './model/webhookReqDto'
import { WebhookService } from './webhook.service'
import { MessageHandlerFactory } from './eventHandler/MessageHandlerFactory'

@Controller('webhook')
export class WebhookController {
	constructor(
		private webhookService: WebhookService,
		private messageHandlerFactory: MessageHandlerFactory
	) {}
	@Post()
	async webhook(@Body() request: WebhookRequestDto) {
		const botUserId = request.destination
		const events = request.events
		Promise.all(
			events.map(async event => {
				const lineUserId = event.source.userId
				const eventType = event.type
				if (eventType !== EventType.Message) {
					Logger.log(`Unsupported Event Type: eventType=${eventType}`)
				}
				const messageType = event.message.type
				const isBotOwner = await this.webhookService.isBotOwner(
					lineUserId,
					botUserId
				)
				const messageHandler = this.messageHandlerFactory.getMessageHandler(
					isBotOwner,
					messageType
				)
				if (!!messageHandler) {
					await messageHandler.handle(event)
				} else {
					Logger.log(
						`Unsupported Message Type: isBotOwner=${isBotOwner}, messageType=${messageType}`
					)
				}
			})
		)
	}
}
