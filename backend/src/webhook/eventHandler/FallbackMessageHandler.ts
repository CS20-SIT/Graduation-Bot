import { LineApiService } from 'src/lineapi/lineapi.service'
import { WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'

export class FallbackMessageEventHandler implements MessageHandler {
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
		await this.lineApiService.replyFallbackMessage(
			channelAccessToken,
			event.replyToken
		)
	}
}
