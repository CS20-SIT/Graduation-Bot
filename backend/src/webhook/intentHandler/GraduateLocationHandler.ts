import {
	LineLocationMessage,
	LineMessage,
	LineTextMessage
} from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { GraduateService } from 'src/graduate/graduate.service'
import { Logger } from '@nestjs/common'
import { MessageType } from '../model/webhookReqDto'
import { quickReply } from 'src/constants'

export class GraduateLocationHandler implements IntentHandler {
	constructor(private graduateService: GraduateService) {}

	async getResponseMessages(botUserId: string): Promise<Array<LineMessage>> {
		const graduate = await this.graduateService.getGraduateByBotUserId(botUserId)
		if (!graduate) {
			Logger.error(`Graduate not found: botUserId=${botUserId}`)
			return
		}
		if (!!graduate.latestLocation) {
			const { latitude, longitude, title, address } = graduate.latestLocation
			return [
				{
					type: MessageType.Location,
					latitude,
					longitude,
					title,
					address,
					quickReply: {
						items: quickReply
					}
				} as LineLocationMessage
			] as Array<LineMessage>
		} else {
			return [
				{
					type: MessageType.Text,
					text: `ขออภัยด้วย บัณฑิตยังไม่ได้อัพเดทตำแหน่งล่าสุด กรุณาติดต่อบัณฑิตผ่านเบอร์โทรศัพท์ ${graduate.mobileNo} หรือช่องทาง Social Media`,
					quickReply: {
						items: quickReply
					}
				} as LineTextMessage
			] as Array<LineMessage>
		}
	}
}
