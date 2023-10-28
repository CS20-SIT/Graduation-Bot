import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType, WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { LineImageMessage } from 'src/lineapi/model/message'
import { BucketStorageService } from 'src/storage/bucketStorage.service'
import { Readable, Writable } from 'stream'
import { ulid } from 'ulid'

export class OwnerImageMessageEventHandler implements MessageHandler {
	constructor(
		private bucketStorageService: BucketStorageService,
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

		const filePath = `${id}_${firstName}/owner_pics/${ulid()}.jpg`
		const storageWriteStream =
			this.bucketStorageService.getObjectWriteStream(filePath)
		await this.pipeStreams(readStream, storageWriteStream)
		const imageUrl = await this.bucketStorageService.getImageUrl(filePath)
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
