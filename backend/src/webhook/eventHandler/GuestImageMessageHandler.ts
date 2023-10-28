import { BucketStorageService } from 'src/storage/bucketStorage.service'
import { WebhookEvent } from '../model/webhookReqDto'
import { MessageHandler } from './MessageHandler'
import { LineApiService } from 'src/lineapi/lineapi.service'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { Readable, Writable } from 'stream'

export class GuestImageMessageHandler implements MessageHandler {
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
		const [readStream, guestProfile] = await Promise.all([
			this.lineApiService.getContentStream(channelAccessToken, event.message.id),
			this.lineApiService.getUserProfile(channelAccessToken, event.source.userId)
		])

		const storageWriteStream = this.bucketStorageService.getObjectWriteStream(
			`${id}_${firstName}/guest_pics/${guestProfile.displayName}_${event.timestamp}.jpg`
		)
		await this.pipeStreams(readStream.data, storageWriteStream)
	}

	pipeStreams(readStream: Readable, writeStream: Writable): Promise<void> {
		return new Promise((resolve, reject) => {
			readStream.pipe(writeStream).on('finish', resolve).on('error', reject)
		})
	}
}
