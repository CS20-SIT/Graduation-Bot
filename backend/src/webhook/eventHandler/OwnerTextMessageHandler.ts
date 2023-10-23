import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType, TextMessage, WebhookEvent } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { LineTextMessage } from 'src/lineapi/model/message'

export class OwnerTextMessageEventHandler implements IMessageHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {}
	async handle(event: WebhookEvent, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const { channelAccessToken } = graduate
		const message = event.message as TextMessage
		await this.lineApiService.broadcastMessage(
			channelAccessToken,
			[{ type: MessageType.Text, text: message.text } as LineTextMessage],
			botUserId
		)
		return
	}
}
