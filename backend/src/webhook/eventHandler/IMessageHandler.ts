import { WebhookEvent } from '../model/webhookReqDto'

export interface IMessageHandler {
	handle(event: WebhookEvent, botUserId: string): Promise<void>
}
