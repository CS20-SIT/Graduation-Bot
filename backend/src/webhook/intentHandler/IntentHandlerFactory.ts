import { Injectable } from '@nestjs/common'
import { IntentHandler } from './IntentHandler'
import { GraduateInfoHandler } from './GraduateInfoHandler'
import { MapHandler } from './MapHandler'
import { TimelineHandler } from './TimeLineHandler'
import { GraduateLocationHandler } from './GraduateLocationHandler'
import { GraduateService } from 'src/graduate/graduate.service'

@Injectable()
export class IntentHandlerFactory {
	private intentHandlerMap: Map<string, IntentHandler>
	constructor(private graduateService: GraduateService) {
		this.intentHandlerMap = new Map<string, IntentHandler>([
			['ข้อมูลของบัณฑิต', new GraduateInfoHandler(graduateService)],
			['ตำแหน่งของบัณฑิต', new GraduateLocationHandler(graduateService)],
			['กำหนดการ', new TimelineHandler()],
			['แผนที่', new MapHandler()]
		])
	}
	getIntentHandler(intent: string): IntentHandler {
		return this.intentHandlerMap.get(intent)
	}
}
