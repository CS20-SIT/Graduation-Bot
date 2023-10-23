import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType, WebhookEvent } from '../model/webhookReqDto'
import { IMessageHandler } from './IMessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { LineImageMessage } from 'src/lineapi/model/message'
import { StorageService } from 'src/storage/storage.service'
import { Readable, Writable } from 'stream'

export class OwnerImageMessageEventHandler implements IMessageHandler {
	constructor(
		private storageService: StorageService,
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {}
	async handle(event: WebhookEvent, botUserId: string): Promise<void> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		const { channelAccessToken, id, firstName } = graduate
		const readStream = await this.lineApiService.getContentStream(
			channelAccessToken,
			event.message.id
		)

		const filePath = `${id}_${firstName}/owner_pics/${event.timestamp}.jpg`
		const storageWriteStream = this.storageService.getObjectWriteStream(filePath)
		await this.pipeStreams(readStream, storageWriteStream)
		const imageUrl = await this.storageService.getImageUrl(filePath)
		await this.lineApiService.broadcastMessage(
			channelAccessToken,
			[
				{
					type: MessageType.Image,
					previewImageUrl: imageUrl,
					originalContentUrl: imageUrl
				} as LineImageMessage
			],
			botUserId
		)
	}

	pipeStreams(readStream: Readable, writeStream: Writable): Promise<void> {
		return new Promise((resolve, reject) => {
			readStream.pipe(writeStream).on('finish', resolve).on('error', reject)
		})
	}
}
