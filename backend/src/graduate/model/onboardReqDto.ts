import { IsEnum, IsOptional, IsString, Length } from 'class-validator'

export enum Honor {
	First = 'First Class Honors',
	Second = 'Second Class Honors'
}

export class OnboardRequestDto {
	@IsString()
	lineUserId: string
	@Length(11)
	studentId: string
	@IsString()
	firstName: string
	@IsString()
	lastName: string
	@Length(10)
	mobileNo: string
	@IsEnum(Honor)
	honor: Honor | null
	@IsString()
	@IsOptional()
	currentJob: string | null
	@IsString()
	@IsOptional()
	currentCompany: string | null
	@IsString()
	fallbackMessage: string
	@IsString()
	channelAccessToken: string
}
