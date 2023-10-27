import { LineMessage, LineTextMessage } from 'src/lineapi/model/message'
import { IntentHandler } from './IntentHandler'
import { quickReply } from 'src/constants'
import { MessageType } from '../model/webhookReqDto'

export class TimelineHandler implements IntentHandler {
	async getResponseMessages(): Promise<Array<LineMessage>> {
		return [
			{
				type: MessageType.Text,
				text: 'วันเสาร์ที่ 11 พฤศจิกายน 2566\n07:45 - 08:15 บัณฑิตถ่ายภาพหมู่ที่โรงยิม (อาคารพระจอมเกล้าราชานุสรณ์ 190 ปี)\n08:30 - 11:00 บัณฑิตเข้าร่วมพิธีปัจฉิมนิเทศคณะ SIT ที่ห้อง V Space ชั้น 15 อาคารการเรียนรู้พหุวิทยาการ​ (LX)\n11:00 - 12:00 บัณฑิตรับประทานอาหารกลางวัน\n12:00 เป็นต้นไป เรียนเชิญแขกทุกท่านร่วมแสดงความยินดีกับบัณฑิต',
				quickReply: {
					items: quickReply
				}
			} as LineTextMessage
		] as Array<LineMessage>
	}
}
