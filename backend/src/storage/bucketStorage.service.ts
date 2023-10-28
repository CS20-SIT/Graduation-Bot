import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Storage, Bucket } from '@google-cloud/storage'
import { Writable } from 'stream'

@Injectable()
export class BucketStorageService {
	private bucket: Bucket
	constructor(private configService: ConfigService) {
		const storage = new Storage({
			keyFilename: this.configService.get('GCS_KEY_FILE_PATH', undefined)
		})
		this.bucket = storage.bucket(this.configService.get('GCS_BUCKET_NAME'))
	}

	getObjectWriteStream(filePath: string): Writable {
		return this.bucket.file(filePath).createWriteStream()
	}

	async getImageUrl(filePath: string): Promise<string> {
		const [url] = await this.bucket.file(filePath).getSignedUrl({
			version: 'v4',
			action: 'read',
			expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // max expiry is 1 week
		})
		return url
	}
}
