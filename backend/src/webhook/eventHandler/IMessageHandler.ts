import { WebhookEvent } from '../model/webhookReqDto'

export interface IMessageHandler {
	handle(event: WebhookEvent): Promise<void>
}
