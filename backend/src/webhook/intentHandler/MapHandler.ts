import { LineImageMessage, LineMessage } from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { quickReply } from 'src/constants'
import { MessageType } from '../model/webhookReqDto'

export class MapHandler implements IntentHandler {
	async getResponseMessages(): Promise<Array<LineMessage>> {
		return [
			{
				type: MessageType.Image,
				previewImageUrl: 'https://img.cscms.me/JABjhw5ibNSplJr3s295.jpg',
				originalContentUrl: 'https://img.cscms.me/JABjhw5ibNSplJr3s295.jpg',
				quickReply: {
					items: quickReply
				}
			} as LineImageMessage
		] as Array<LineMessage>
	}
}
