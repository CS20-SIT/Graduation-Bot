import { MessageType } from 'src/webhook/model/webhookReqDto'

export class LineMessage {
	type: MessageType
	quickReply?: QuickReply
}

export class LineTextMessage extends LineMessage {
	text: string
}

export class QuickReply {
	items: Array<QuickReplyItem>
}
export class QuickReplyItem {
	type: string
	imageUrl?: string
	action: QuickReplyAction
}

export class QuickReplyAction {
	type: string
	label: string
	text: string
}

export class LineImageMessage extends LineMessage {
	originalContentUrl: string
	previewImageUrl: string
}

export class LineLocationMessage extends LineMessage {
	latitude: number
	longitude: number
	address: string
	title: string
}
