import { LineApiService } from 'src/lineapi/lineapi.service'
import { MessageType } from '../model/webhookReqDto'
import { CommandHandler } from './CommandHandler'
import { LineTextMessage } from 'src/lineapi/model/message'
import { quickReply } from 'src/constants'

export class HelpHandler implements CommandHandler {
	constructor(private lineApiService: LineApiService) {}
	async handle(
		channelAccessToken: string,
		botUserId: string,
		replyToken: string
	): Promise<void> {
		await this.lineApiService.replyMessage(
			channelAccessToken,
			[
				{
					type: MessageType.Text,
					text: 'คำสั่งสำหรับเจ้าของบอท\n/b <message> - ใช้สำหรับบรอดแคสต์ข้อความ\n/h - ใช้สำหรับเรียกดูคู่มือการใช้งาน\n/d - ใช้สำหรับรับลิงก์ Google Drive สำหรับดาวน์โหลดรูป\nคำสั่งทั่วไปสำหรับผู้ใช้งาน\nข้อมูลของบัณฑิต - ใช้สำหรับดูข้อมูลของบัณฑิต\nตำแหน่งของบัณฑิต - ใช้สำหรับตรวจสอบตำแหน่งล่าสุดของบัณฑิต\nกำหนดการ - ใช้สำหรับดูกำหนดการ\nแผนที่ - ใช้สำหรับดูแผนที่ภายในมหาวิทยาลัย',
					quickReply: {
						items: quickReply
					}
				} as LineTextMessage
			],
			replyToken
		)
	}
}
