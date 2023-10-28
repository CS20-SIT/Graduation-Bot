import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType } from '../model/webhookReqDto'
import { CommandHandler } from './CommandHandler'
import { LineTextMessage } from 'src/lineapi/model/message'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'

export class DriveHandler implements CommandHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {}
	async handle(channelAccessToken: string, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		// todo: get driveUrl from graduate
		const driveUrl = 'mockDriveURL'
		await this.lineApiService.broadcastMessage(
			channelAccessToken,
			[
				{
					type: MessageType.Text,
					text: `คุณสามารถดาวน์โหลดรูปได้จาก: ${driveUrl}`
				} as LineTextMessage
			],
			botUserId
		)
	}
}
