import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleAuth } from 'google-auth-library'
import { google, drive_v3 } from 'googleapis'

@Injectable()
export class DriveStorageService {
	private drive: drive_v3.Drive
	constructor(configService: ConfigService) {
		const auth = new GoogleAuth({
			scopes: 'https://www.googleapis.com/auth/drive',
			keyFilename: configService.get('GCS_KEY_FILE_PATH', undefined)
		})
		this.drive = google.drive({ version: 'v3', auth })
	}

	async createEmptyFolder(name: string): Promise<string> {
		const res = await this.drive.files.create({
			requestBody: {
				name,
				mimeType: 'application/vnd.google-apps.folder'
			}
		})
		return res.data.id
	}

	async getSharedLink(fileId: string): Promise<string> {
		await this.drive.permissions.create({
			fileId,
			requestBody: {
				role: 'reader',
				type: 'anyone'
			}
		})
		const res = await this.drive.files.get({
			fileId,
			fields: 'webViewLink'
		})
		return res.data.webViewLink
	}
}
