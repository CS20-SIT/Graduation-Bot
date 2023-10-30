import { Module } from '@nestjs/common'
import { BucketStorageService } from './bucketStorage.service'
import { ConfigModule } from '@nestjs/config'
import { DriveStorageService } from './driveStorage.service'

@Module({
	imports: [ConfigModule],
	providers: [BucketStorageService, DriveStorageService],
	exports: [BucketStorageService, DriveStorageService]
})
export class StorageModule {}
