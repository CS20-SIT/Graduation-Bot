import { Injectable } from '@nestjs/common'
import { MessageType } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'
import { OwnerTextMessageEventHandler } from './OwnerTextMessageHandler'
import { GuestImageMessageHandler } from './GuestImageMessageHandler'
import { StorageService } from 'src/storage/storage.service'
import { GraduateService } from 'src/graduate/graduate.service'
import { LineApiService } from 'src/lineapi/lineapi.service'
import { OwnerImageMessageEventHandler } from './OwnerImageMessageHandler'
import { OwnerLocationMessageEventHandler } from './OwnerLocationMessageHandler'

@Injectable()
export class MessageHandlerFactory {
	private messageHandlerMap: Map<string, IMessageHandler>
	constructor(
		private storageService: StorageService,
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {
		this.messageHandlerMap = new Map<string, IMessageHandler>([
			[
				this.getKey(true, MessageType.Text),
				new OwnerTextMessageEventHandler(lineApiService, graduateService)
			],
			[
				this.getKey(true, MessageType.Image),
				new OwnerImageMessageEventHandler(
					storageService,
					lineApiService,
					graduateService
				)
			],
			[
				this.getKey(true, MessageType.Location),
				new OwnerLocationMessageEventHandler(lineApiService, graduateService)
			],
			[
				this.getKey(false, MessageType.Image),
				new GuestImageMessageHandler(
					storageService,
					lineApiService,
					graduateService
				)
			]
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
