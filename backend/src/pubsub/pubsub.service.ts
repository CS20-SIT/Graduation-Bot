import { Injectable } from '@nestjs/common'
import { PubSub, Topic } from '@google-cloud/pubsub'
import { ConfigService } from '@nestjs/config'
import { GuestMediaMessage } from './model/guestMediaMessage'

@Injectable()
export class PubsubService {
	private client: PubSub
	private guestMediaTopic: Topic

	constructor(private configService: ConfigService) {
		this.client = new PubSub({
			keyFilename: this.configService.get('GCS_KEY_FILE_PATH', undefined)
		})
		this.guestMediaTopic = this.client.topic(
			this.configService.getOrThrow('GUEST_MEDIA_TOPIC_NAME')
		)
	}

	async publishGuestMediaMessage(msg: GuestMediaMessage): Promise<void> {
		await this.guestMediaTopic.publishJSON(msg)
	}
}
