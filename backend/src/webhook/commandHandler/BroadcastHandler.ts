import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType } from '../model/webhookReqDto'
import { CommandHandler } from './CommandHandler'
import { LineTextMessage } from 'src/lineapi/model/message'

export class BroadcastHandler implements CommandHandler {
	constructor(private lineApiService: LineApiService) {}
	async handle(
		channelAccessToken: string,
		botUserId: string,
		replyToken: string,
		text: string
	): Promise<void> {
		await this.lineApiService.broadcastMessage(
			channelAccessToken,
			[{ type: MessageType.Text, text } as LineTextMessage],
			botUserId
		)
	}
}
