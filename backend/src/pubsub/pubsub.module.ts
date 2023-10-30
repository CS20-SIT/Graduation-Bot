import { Module } from '@nestjs/common'
import { PubsubService } from './pubsub.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule],
	providers: [PubsubService],
	exports: [PubsubService]
})
export class PubsubModule {}
