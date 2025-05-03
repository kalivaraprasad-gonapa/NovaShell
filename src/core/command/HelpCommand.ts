import {
  CommandResult,
  ICommand,
  ICommandRegistry,
} from "../interfaces/ICommand";

export class HelpCommand implements ICommand {
  readonly id = "help";
  readonly description = "Display help for commands";
  private readonly commandRegistry: ICommandRegistry;

  constructor(commandRegistry: ICommandRegistry) {
    this.commandRegistry = commandRegistry;
  }

  validate(args: string[]): boolean {
    return args.length <= 1; // Help can be called with 0 or 1 argument
  }

  async execute(args: string[]): Promise<CommandResult> {
    const commandId = args[0];

    if (commandId) {
      const command = this.commandRegistry.getCommand(commandId);
      if (!command) {
        return {
          output: `No help available for command: ${commandId}`,
          exitCode: 1,
        };
      }

      return {
        output: `${command.id}: ${command.description}`,
        exitCode: 0,
      };
    }

    // List all commands
    const allCommands = this.commandRegistry.getAllCommands();
    const commandList = allCommands
      .map((cmd) => `${cmd.id}: ${cmd.description}`)
      .join("\n");

    return {
      output: `Available commands:\n${commandList}`,
      exitCode: 0,
    };
  }
}
