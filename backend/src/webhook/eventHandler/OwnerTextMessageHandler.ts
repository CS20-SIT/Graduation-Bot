import { WebhookEvent } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'

export class OwnerTextMessageEventHandler implements IMessageHandler {
	constructor() {}
	handle(event: WebhookEvent, botUserId: string): Promise<void> {
		console.log(event, botUserId)
		return
	}
}
