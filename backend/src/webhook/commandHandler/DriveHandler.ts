import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType } from '../model/webhookReqDto'
import { CommandHandler } from './CommandHandler'
import { LineTextMessage } from 'src/lineapi/model/message'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { quickReply } from 'src/constants'

export class DriveHandler implements CommandHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {}
	async handle(
		channelAccessToken: string,
		botUserId: string,
		replyToken: string
	): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const driveUrl = graduate.mediaDrive?.sharedLink

		await this.lineApiService.replyMessage(
			channelAccessToken,
			[
				{
					type: MessageType.Text,
					text: `คุณสามารถดาวน์โหลดรูปได้จาก: ${driveUrl}`,
					quickReply: {
						items: quickReply
					}
				} as LineTextMessage
			],
			replyToken
		)
	}
}
