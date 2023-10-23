import { LineApiService } from 'src/lineapi/lineapi.service'
import { LocationMessage, MessageType, WebhookEvent } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { LineLocationMessage } from 'src/lineapi/model/message'

export class OwnerLocationMessageEventHandler implements IMessageHandler {
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
		const { channelAccessToken, id } = graduate
		const { latitude, longitude } = event.message as LocationMessage

		await Promise.all([
			this.graduateService.setLatestLocationById(id, {
				latitude,
				longitude,
				updatedAt: new Date(event.timestamp)
			}),
			this.lineApiService.broadcastMessage(
				channelAccessToken,
				[
					{
						type: MessageType.Location,
						title: "Graduate's location",
						address: "Graduate's location",
						longitude,
						latitude
					} as LineLocationMessage
				],
				botUserId
			)
		])
	}
}
