import { ObjectId } from 'bson'
import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	Post
} from '@nestjs/common'
import { OnboardRequestDto } from './model/onboardReqDto'
import { GraduateService } from './graduate.service'
import { LineApiService } from 'src/lineapi/lineapi.service'
import axios from 'axios'
import { DriveStorageService } from 'src/storage/driveStorage.service'

@Controller('graduate')
export class GraduateController {
	constructor(
		private graduateService: GraduateService,
		private lineApiService: LineApiService,
		private driveStorageService: DriveStorageService
	) {}
	@Post()
	async onboard(@Body() body: OnboardRequestDto) {
		const { channelAccessToken, lineUserId, studentId } = body
		const isExist = await this.graduateService.isExistByStudentId(studentId)
		if (isExist) throw new BadRequestException('Graduate is already exist.')

		try {
			const [botInfo, userProfile] = await Promise.all([
				this.lineApiService.getBotInfo(channelAccessToken),
				this.lineApiService.getUserProfile(channelAccessToken, lineUserId)
			])
			const folderId = await this.driveStorageService.createEmptyFolder(
				`${userProfile.displayName}_${body.firstName}_media`
			)
			const mediaFolderLink = await this.driveStorageService.getSharedLink(folderId)
			return await this.graduateService.createGradute({
				...body,
				id: new ObjectId().toHexString(),
				displayName: userProfile.displayName,
				pictureUrl: userProfile.pictureUrl,
				botUserId: botInfo.userId,
				attendeeIds: [],
				latestLocation: null,
				mediaDrive: {
					parentFolderId: folderId,
					sharedLink: mediaFolderLink
				}
			})
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new BadRequestException(
					'invalid channel access token or line user id'
				)
			}
			throw new InternalServerErrorException(error)
		}
	}
}
