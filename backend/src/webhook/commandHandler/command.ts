export enum Command {
	BROADCAST = 'b',
	HELP = 'h',
	DRIVE = 'd'
}

export const isCommand = (command: string): command is Command => {
	return (Object.values(Command) as Array<string>).includes(command)
}
