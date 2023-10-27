import { LineImageMessage, LineMessage } from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { quickReply } from 'src/constants'
import { MessageType } from '../model/webhookReqDto'

export class MapHandler implements IntentHandler {
	async getResponseMessages(): Promise<Array<LineMessage>> {
		return [
			{
				type: MessageType.Image,
				previewImageUrl:
					'https://www.kmutt.ac.th/wp-content/uploads/2021/01/Master-Plan.jpg',
				originalContentUrl:
					'https://www.kmutt.ac.th/wp-content/uploads/2021/01/Master-Plan.jpg',
				quickReply: {
					items: quickReply
				}
			} as LineImageMessage
		] as Array<LineMessage>
	}
}
