import { IsArray, IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'

export class WebhookRequestDto {
	@IsString()
	destination: string

	@IsArray()
	events: Array<WebhookEvent>
}

export enum EventType {
	Message = 'message',
	Follow = 'follow',
	Unfollow = 'unfollow',
	Join = 'join',
	Leave = 'leave',
	Postback = 'postback',
	Beacon = 'beacon'
}

export enum ChannelMode {
	Active = 'active',
	StandBy = 'standby'
}
export class WebhookEvent {
	@IsEnum(EventType)
	type: EventType
	message: WebhookMessage
	@IsString()
	webhookEventId: string
	deliveryContext: DeliveryContext
	@IsNumber()
	timestamp: number
	source: Source
	@IsString()
	replyToken: string
	@IsEnum(ChannelMode)
	mode: ChannelMode
}

export enum MessageType {
	Text = 'text',
	Image = 'image',
	Video = 'video',
	Audio = 'audio',
	Location = 'location',
	Sticker = 'sticker'
}

export class WebhookMessage {
	@IsEnum(MessageType)
	type: MessageType
	@IsString()
	id: string
	@IsString()
	quoteToken: string
}

export class TextMessage extends WebhookMessage {
	@IsString()
	text: string
}

export class DeliveryContext {
	@IsBoolean()
	isRedelivery: boolean
}

export enum SourceType {
	User = 'user',
	Group = 'group',
	Room = 'room'
}

export class Source {
	@IsEnum(SourceType)
	type: SourceType
	@IsString()
	userId: string
}
