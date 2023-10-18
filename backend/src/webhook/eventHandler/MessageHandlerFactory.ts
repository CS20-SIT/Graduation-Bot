import { Injectable } from '@nestjs/common'
import { MessageType } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'
import { OwnerTextMessageEventHandler } from './OwnerTextMessageHandler'

@Injectable()
export class MessageHandlerFactory {
	private messageHandlerMap: Map<string, IMessageHandler>
	constructor() {
		this.messageHandlerMap = new Map<string, IMessageHandler>([
			[this.getKey(true, MessageType.Text), new OwnerTextMessageEventHandler()]
		])
	}
	private getKey(isBotOwner: boolean, messageType: MessageType): string {
		return `${messageType}-${isBotOwner ? 'graduate' : 'attendee'}`
	}
	getMessageHandler(isBotOwner: boolean, messageType: MessageType): IMessageHandler {
		const key = this.getKey(isBotOwner, messageType)
		return this.messageHandlerMap.get(key)
	}
}
