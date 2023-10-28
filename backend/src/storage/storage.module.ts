import { Module } from '@nestjs/common'
import { BucketStorageService } from './bucketStorage.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule],
	providers: [BucketStorageService],
	exports: [BucketStorageService]
})
export class StorageModule {}
