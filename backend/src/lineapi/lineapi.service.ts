import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { BotInfo } from './model/botInfo'
import { UserProfile } from './model/userProfile'
import { Readable } from 'stream'
import { LineMessage } from './model/message'

@Injectable()
export class LineApiService {
	private client: AxiosInstance
	private contentClient: AxiosInstance
	constructor() {
		this.client = axios.create({ baseURL: 'https://api.line.me/v2/bot' })
		this.contentClient = axios.create({
			baseURL: 'https://api-data.line.me/v2/bot'
		})
	}

	async getBotInfo(channelAccessToken: string): Promise<BotInfo> {
		const { data } = await this.client.get<BotInfo>('/info', {
			headers: {
				Authorization: `Bearer ${channelAccessToken}`
			}
		})
		return data
	}

	async getUserProfile(
		channelAccessToken: string,
		userId: string
	): Promise<UserProfile> {
		const { data } = await this.client.get<UserProfile>(`/profile/${userId}`, {
			headers: {
				Authorization: `Bearer ${channelAccessToken}`
			}
		})
		return data
	}

	async getContentStream(
		channelAccessToken: string,
		messageId: string
	): Promise<Readable> {
		const { data } = await this.contentClient.get<Readable>(
			`/message/${messageId}/content`,
			{
				headers: {
					Authorization: `Bearer ${channelAccessToken}`
				},
				responseType: 'stream'
			}
		)
		return data
	}

	async broadcastMessage(
		channelAccessToken: string,
		messages: Array<LineMessage>,
		botUserId: string
	): Promise<void> {
		try {
			await this.client.post(
				'/message/broadcast',
				{
					messages
				},
				{
					headers: {
						Authorization: `Bearer ${channelAccessToken}`
					}
				}
			)
		} catch (exception) {
			Logger.error(
				`Failed to broadcast message due to: ${JSON.stringify(
					exception.response.data
				)} botUserId= ${botUserId}`
			)
		}
	}
}
