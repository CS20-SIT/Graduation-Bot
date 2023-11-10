import { LineMessage, LineTextMessage } from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { quickReply } from 'src/constants'
import { MessageType } from '../model/webhookReqDto'

export class HelpHandler implements IntentHandler {
	async getResponseMessages(): Promise<LineMessage[]> {
		return [
			{
				type: MessageType.Text,
				text: 'คำสั่งทั่วไปสำหรับผู้ใช้งาน\nข้อมูลของบัณฑิต - ใช้สำหรับดูข้อมูลของบัณฑิต\nตำแหน่งของบัณฑิต - ใช้สำหรับตรวจสอบตำแหน่งล่าสุดของบัณฑิต\nกำหนดการ - ใช้สำหรับดูกำหนดการ\nแผนที่ - ใช้สำหรับดูแผนที่ภายในมหาวิทยาลัย',
				quickReply: {
					items: quickReply
				}
			} as LineTextMessage
		] as Array<LineMessage>
	}
}
