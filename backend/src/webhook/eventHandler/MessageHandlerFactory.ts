import { Injectable } from '@nestjs/common'
import { MessageType } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { OwnerTextMessageEventHandler } from './OwnerTextMessageHandler'
import { GuestImageMessageHandler } from './GuestImageMessageHandler'
import { StorageService } from 'src/storage/storage.service'
import { GraduateService } from 'src/graduate/graduate.service'
import { LineApiService } from 'src/lineapi/lineapi.service'
import { OwnerImageMessageEventHandler } from './OwnerImageMessageHandler'
import { OwnerLocationMessageEventHandler } from './OwnerLocationMessageHandler'
import { GuestTextMessageEventHandler } from './GuestTextMessageHandler'
import { FallbackMessageEventHandler } from './FallbackMessageHandler'
import { IntentHandlerFactory } from '../intentHandler/IntentHandlerFactory'
import { CommandHandlerFactory } from '../commandHandler/CommandHandlerFactory'

@Injectable()
export class MessageHandlerFactory {
	private messageHandlerMap: Map<string, MessageHandler>
	private fallbackMessageHandler: MessageHandler
	constructor(
		private storageService: StorageService,
		private lineApiService: LineApiService,
		private graduateService: GraduateService,
		private commandHandlerFactory: CommandHandlerFactory,
		private intentHandlerFactory: IntentHandlerFactory
	) {
		this.messageHandlerMap = new Map<string, MessageHandler>([
			[
				this.getKey(true, MessageType.Text),
				new OwnerTextMessageEventHandler(
					lineApiService,
					graduateService,
					commandHandlerFactory,
					intentHandlerFactory
				)
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
				this.getKey(false, MessageType.Text),
				new GuestTextMessageEventHandler(
					lineApiService,
					graduateService,
					intentHandlerFactory
				)
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
		this.fallbackMessageHandler = new FallbackMessageEventHandler(
			lineApiService,
			graduateService
		)
	}
	private getKey(isBotOwner: boolean, messageType: MessageType): string {
		return `${messageType}-${isBotOwner ? 'graduate' : 'attendee'}`
	}
	getMessageHandler(isBotOwner: boolean, messageType: MessageType): MessageHandler {
		const key = this.getKey(isBotOwner, messageType)
		return this.messageHandlerMap.get(key)
	}

	getFallbackMessageHandler(): MessageHandler {
		return this.fallbackMessageHandler
	}
}
