import { Module } from '@nestjs/common'
import { GraduateService } from './graduate.service'
import { GraduateController } from './graduate.controller'
import { LineApiModule } from 'src/lineapi/lineapi.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { StorageModule } from 'src/storage/storage.module'

@Module({
	imports: [LineApiModule, PrismaModule, StorageModule],
	providers: [GraduateService],
	controllers: [GraduateController],
	exports: [GraduateService]
})
export class GraduateModule {}
