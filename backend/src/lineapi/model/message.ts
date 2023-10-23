import { MessageType } from 'src/webhook/model/webhookReqDto'

export class LineMessage {
	type: MessageType
}

export class LineTextMessage extends LineMessage {
	text: string
}
