import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class WebhookService {
	constructor(private prismaService: PrismaService) {}

	async isBotOwner(lineUserId: string, botUserId: string): Promise<boolean> {
		const result = await this.prismaService.graduate.findFirst({
			where: {
				lineUserId,
				botUserId
			}
		})
		return result !== null
	}
}
