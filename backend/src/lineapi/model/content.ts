import { Readable } from 'stream'

export interface ContentStream {
	data: Readable
	contentType: string
}
