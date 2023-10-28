import { LineApiService } from 'src/lineapi/lineapi.service'
import { TextMessage, WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { IntentHandlerFactory } from '../intentHandler/IntentHandlerFactory'
import { CommandHandlerFactory } from '../commandHandler/CommandHandlerFactory'
import { Command, isCommand } from '../commandHandler/command'

export class OwnerTextMessageEventHandler implements MessageHandler {
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService,
		private commandHandlerFactory: CommandHandlerFactory,
		private intentHandlerFactory: IntentHandlerFactory
	) {}
	async handle(event: WebhookEvent, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const { channelAccessToken } = graduate
		const message = (event.message as TextMessage).text
		const isCommandMessage = message.startsWith('/')
		if (isCommandMessage) {
			const splitted = message.split(' ')
			const command = splitted[0].replace('/', '')
			const text = splitted.slice(1).join(' ')
			if (isCommand(command)) {
				const commandHandler = this.commandHandlerFactory.getComamndHandler(
					command as Command
				)
				if (!!commandHandler) {
					await commandHandler.handle(channelAccessToken, botUserId, text)
					return
				}
			}
		}
		const intentHandler = this.intentHandlerFactory.getIntentHandler(message)
		if (!!intentHandler) {
			const replyToken = event.replyToken
			const messages = await intentHandler.getResponseMessages(botUserId)
			await this.lineApiService.replyMessage(
				channelAccessToken,
				messages,
				replyToken
			)
			return
		}
		const helpCommandHandler = this.commandHandlerFactory.getFallbackCommandHandler()
		await helpCommandHandler.handle(channelAccessToken, botUserId)
	}
}
