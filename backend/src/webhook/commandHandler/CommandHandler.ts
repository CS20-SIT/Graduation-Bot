export interface CommandHandler {
	handle(
		channelAccessToken: string,
		botUserId: string,
		replyToken?: string,
		text?: string
	): Promise<void>
}
