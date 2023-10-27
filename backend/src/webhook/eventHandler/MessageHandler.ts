import { WebhookEvent } from '../model/webhookReqDto'

export interface MessageHandler {
	handle(event: WebhookEvent, botUserId: string): Promise<void>
}
