import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { BotInfo } from './model/botInfo'
import { UserProfile } from './model/userProfile'

@Injectable()
export class LineApiService {
	private client: AxiosInstance
	constructor() {
		this.client = axios.create({ baseURL: 'https://api.line.me/v2/bot' })
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
		userId: string,
		channelAccessToken: string
	): Promise<UserProfile> {
		const { data } = await this.client.get<UserProfile>(`/profile/${userId}`, {
			headers: {
				Authorization: `Bearer ${channelAccessToken}`
			}
		})
		return data
	}
}
