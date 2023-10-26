import { LineApiService } from 'src/lineapi/lineapi.service'
import { LocationMessage, MessageType, WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { LineLocationMessage, LineTextMessage } from 'src/lineapi/model/message'
import { Location } from '@prisma/client'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export class OwnerLocationMessageEventHandler implements MessageHandler {
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
		const { channelAccessToken, id, nickName } = graduate
		const { latitude, longitude, title } = event.message as LocationMessage
		const dateTime = dayjs(event.timestamp)
		const location: Location = {
			latitude,
			longitude,
			title: title ?? `Graduate's location`,
			address: `Graduate's location on ${dateTime.utcOffset(7).format('HH:mm')}`,
			updatedAt: dateTime.toDate()
		}

		await Promise.allSettled([
			this.graduateService.setLatestLocationById(id, location),
			this.lineApiService.broadcastMessage(
				channelAccessToken,
				[
					{
						type: MessageType.Text,
						text: `${nickName ?? 'บัณฑิต'}อัพเดทตำแหน่งล่าสุด`
					} as LineTextMessage,
					{
						type: MessageType.Location,
						latitude,
						longitude,
						title: location.title,
						address: location.address
					} as LineLocationMessage
				],
				botUserId
			)
		])
	}
}
