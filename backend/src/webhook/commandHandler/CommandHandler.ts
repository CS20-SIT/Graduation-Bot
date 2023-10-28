export interface CommandHandler {
	handle(channelAccessToken: string, botUserId: string, text?: string): Promise<void>
}
