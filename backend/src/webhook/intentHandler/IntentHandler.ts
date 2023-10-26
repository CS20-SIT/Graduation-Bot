import { LineMessage } from 'src/lineapi/model/message'

export interface IntentHandler {
	getResponseMessages(botUserId: string): Promise<Array<LineMessage>>
}
