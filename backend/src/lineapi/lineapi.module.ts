import { Module } from '@nestjs/common'
import { LineApiService } from './lineapi.service'

@Module({
	providers: [LineApiService],
	exports: [LineApiService]
})
export class LineApiModule {}
