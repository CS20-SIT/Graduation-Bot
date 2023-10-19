import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Storage, Bucket } from '@google-cloud/storage'
import { Writable } from 'stream'

@Injectable()
export class StorageService {
	private bucket: Bucket
	constructor(private configService: ConfigService) {
		const storage = new Storage()
		this.bucket = storage.bucket(this.configService.get('GCS_BUCKET_NAME'))
	}

	getObjectWriteStream(filePath: string): Writable {
		return this.bucket.file(filePath).createWriteStream()
	}
}
