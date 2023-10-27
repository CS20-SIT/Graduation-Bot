import { LineApiService } from 'src/lineapi/lineapi.service'
import { TextMessage, WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { IntentHandlerFactory } from '../intentHandler/IntentHandlerFactory'

export class GuestTextMessageEventHandler implements MessageHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService,
		private intentHandlerFactory: IntentHandlerFactory
	) {}
	async handle(event: WebhookEvent, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const { channelAccessToken } = graduate
		const replyToken = event.replyToken
		const intent = (event.message as TextMessage).text
		const intentHandler = this.intentHandlerFactory.getIntentHandler(intent)
		if (!!intentHandler) {
			const messages = await intentHandler.getResponseMessages(botUserId)
			await this.lineApiService.replyMessage(
				channelAccessToken,
				messages,
				replyToken
			)
		} else {
			await this.lineApiService.replyFallbackMessage(channelAccessToken, replyToken)
		}
	}
}
