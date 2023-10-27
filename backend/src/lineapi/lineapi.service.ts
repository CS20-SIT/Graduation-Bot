import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { BotInfo } from './model/botInfo'
import { UserProfile } from './model/userProfile'
import { Readable } from 'stream'
import { LineMessage, LineTextMessage } from './model/message'
import { MessageType } from 'src/webhook/model/webhookReqDto'
import { fallbackMessage, quickReply } from 'src/constants'

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
		const { data } = await this.client.get<BotInfo>(
			'/info',
			this.getHeader(channelAccessToken)
		)
		return data
	}

	async getUserProfile(
		channelAccessToken: string,
		userId: string
	): Promise<UserProfile> {
		const { data } = await this.client.get<UserProfile>(
			`/profile/${userId}`,
			this.getHeader(channelAccessToken)
		)
		return data
	}

	async getContentStream(
		channelAccessToken: string,
		messageId: string
	): Promise<Readable> {
		const { data } = await this.contentClient.get<Readable>(
			`/message/${messageId}/content`,
			{
				...this.getHeader(channelAccessToken),
				responseType: 'stream'
			}
		)
		return data
	}

	async replyMessage(
		channelAccessToken: string,
		messages: Array<LineMessage>,
		replyToken: string
	): Promise<void> {
		try {
			await this.client.post(
				'/message/reply',
				{
					messages,
					replyToken
				},
				this.getHeader(channelAccessToken)
			)
		} catch (exception) {
			Logger.error(
				`Failed to broadcast message due to: ${JSON.stringify(
					exception.response.data
				)} replyToken= ${replyToken}`
			)
		}
	}

	async replyFallbackMessage(
		channelAccessToken: string,
		replyToken: string
	): Promise<void> {
		const fallbackMessages = [
			{
				type: MessageType.Text,
				text: fallbackMessage,
				quickReply: {
					items: quickReply
				}
			} as LineTextMessage
		]
		await this.replyMessage(channelAccessToken, fallbackMessages, replyToken)
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
				this.getHeader(channelAccessToken)
			)
		} catch (exception) {
			Logger.error(
				`Failed to broadcast message due to: ${JSON.stringify(
					exception.response.data
				)} botUserId= ${botUserId}`
			)
		}
	}

	private getHeader(channelAccessToken: string): AxiosRequestConfig {
		return {
			headers: {
				Authorization: `Bearer ${channelAccessToken}`
			}
		}
	}
}
