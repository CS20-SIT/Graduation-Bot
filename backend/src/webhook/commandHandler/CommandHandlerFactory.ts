import { Injectable } from '@nestjs/common'
import { GraduateService } from 'src/graduate/graduate.service'
import { CommandHandler } from './CommandHandler'
import { LineApiService } from 'src/lineapi/lineapi.service'
import { Command } from './command'
import { BroadcastHandler } from './BroadcastHandler'
import { HelpHandler } from './HelpHandler'
import { DriveHandler } from './DriveHandler'

@Injectable()
export class CommandHandlerFactory {
	private helpCommandHandler: CommandHandler
	private commandHandlerMap: Map<string, CommandHandler>
	constructor(
		private lineApiService: LineApiService,
		private graduateService: GraduateService
	) {
		this.helpCommandHandler = new HelpHandler(lineApiService)
		this.commandHandlerMap = new Map<string, CommandHandler>([
			[Command.BROADCAST, new BroadcastHandler(lineApiService)],
			[Command.DRIVE, new DriveHandler(lineApiService, graduateService)],
			[Command.HELP, this.helpCommandHandler]
		])
	}
	getComamndHandler(command: Command): CommandHandler {
		return this.commandHandlerMap.get(command)
	}
	getFallbackCommandHandler(): CommandHandler {
		return this.helpCommandHandler
	}
}
