import { WebhookEvent } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'

export class OwnerTextMessageEventHandler implements IMessageHandler {
	constructor() {}
	handle(event: WebhookEvent): Promise<void> {
		console.log(event)
		return
	}
}
