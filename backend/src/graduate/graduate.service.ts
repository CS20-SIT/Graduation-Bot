import { Injectable } from '@nestjs/common'
import { Graduate } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class GraduateService {
	constructor(private prismaService: PrismaService) {}

	async createGradute(graduate: Graduate): Promise<Graduate> {
		return this.prismaService.graduate.create({ data: graduate })
	}

	async isExistByStudentId(studentId: string): Promise<boolean> {
		const count = await this.prismaService.graduate.count({
			where: { studentId }
		})
		return count > 0
	}

	async getGraduateByBotUserId(botUserId: string): Promise<Graduate> {
		return this.prismaService.graduate.findUnique({ where: { botUserId } })
	}
}
