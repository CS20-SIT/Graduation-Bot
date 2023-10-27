import { LineMessage, LineTextMessage } from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { Graduate } from '@prisma/client'
import { Honor } from 'src/graduate/model/onboardReqDto'
import { quickReply } from 'src/constants'
import { MessageType } from '../model/webhookReqDto'

export class GraduateInfoHandler implements IntentHandler {
	constructor(private graduateService: GraduateService) {}
	async getResponseMessages(botUserId: string): Promise<Array<LineMessage>> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		return [
			{
				type: MessageType.Text,
				text: this.getGraduateInformation(graduate),
				quickReply: {
					items: quickReply
				}
			} as LineTextMessage
		] as Array<LineMessage>
	}
	getGraduateInformation(graduate: Graduate): string {
		return [
			`ชื่อ: ${graduate.firstName} ${graduate.lastName} ${this.getNickname(
				graduate.nickName
			)}`,
			`จบการศึกษาคณะเทคโนโลยีสารสนเทศ สาขาวิทยาการคอมพิวเตอร์​ (ภาษาอังกฤษ) ${this.getHonorInformation(
				graduate.honor
			)}`,
			this.getJobInformation(graduate.currentJob, graduate.currentCompany),
			`เบอร์ติดต่อ: ${graduate.mobileNo}`
		].join('\n')
	}
	getNickname(nickName: string | null) {
		if (nickName !== null) {
			return `(${nickName})`
		}
		return ''
	}
	getHonorInformation(honor: string | null) {
		if (honor !== null) {
			if (honor === Honor.First) {
				return 'เกียรตินิยมอันดับ 1'
			} else if (honor === Honor.Second) {
				return 'เกียรตินิยมอันดับ 2'
			}
		}
		return ''
	}
	getJobInformation(currentJob: string | null, currentCompany: string | null) {
		if (currentJob !== null && currentCompany !== null) {
			return `ปัจจุบันทำงานตำแหน่ง ${currentJob} ที่ ${currentCompany}`
		} else if (currentJob !== null) {
			return `ปัจจุบันทำงานตำแหน่ง ${currentJob}`
		} else if (currentCompany !== null) {
			return `ปัจจุบันทำงานที่ ${currentCompany}`
		}
		return ''
	}
}
