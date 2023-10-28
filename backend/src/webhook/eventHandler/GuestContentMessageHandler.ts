import { WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { LineApiService } from 'src/lineapi/lineapi.service'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { PubsubService } from 'src/pubsub/pubsub.service'

export class GuestContentMessageHandler implements MessageHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService,
		private pubsubService: PubsubService
	) {}

	async handle(event: WebhookEvent, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const { channelAccessToken, mediaDrive } = graduate
		const guestProfile = await this.lineApiService.getUserProfile(
			channelAccessToken,
			event.source.userId
		)

		await this.pubsubService.publishGuestMediaMessage({
			channelAccessToken,
			messageId: event.message.id,
			timestamp: event.timestamp,
			guestDisplayName: guestProfile.displayName,
			folderId: mediaDrive.parentFolderId
		})
	}
}
