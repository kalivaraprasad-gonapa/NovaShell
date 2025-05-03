import {
  CommandResult,
  ICommand,
  ICommandParser,
  ICommandRegistry,
  IHistoryManager,
  IShellSession,
} from "../interfaces/ICommand";

export class ShellSession implements IShellSession {
  private readonly commandRegistry: ICommandRegistry;
  private readonly historyManager: IHistoryManager;
  private readonly commandParser: ICommandParser;
  private fallbackCommand?: ICommand;

  constructor(
    commandRegistry: ICommandRegistry,
    historyManager: IHistoryManager,
    commandParser: ICommandParser,
  ) {
    this.commandRegistry = commandRegistry;
    this.historyManager = historyManager;
    this.commandParser = commandParser;
  }

  // Add this method to support setting a fallback command
  public setFallbackCommand(command: ICommand): void {
    this.fallbackCommand = command;
  }

  async executeCommand(commandLine: string): Promise<CommandResult> {
    this.historyManager.add(commandLine);

    const parsedCommand = this.commandParser.parse(commandLine);

    if (!parsedCommand.commandName) {
      return {
        output: "",
        exitCode: 0,
      };
    }

    const command = this.commandRegistry.getCommand(parsedCommand.commandName);

    if (!command) {
      // If no command is found but we have a fallback command, use it
      if (this.fallbackCommand) {
        return this.fallbackCommand.execute([
          parsedCommand.commandName,
          ...parsedCommand.args,
        ]);
      }

      return {
        output: `Command not found: ${parsedCommand.commandName}`,
        exitCode: 127, // Command not found exit code
      };
    }

    if (!command.validate(parsedCommand.args)) {
      return {
        output: `Invalid arguments for command: ${parsedCommand.commandName}`,
        exitCode: 1,
      };
    }

    try {
      return await command.execute(parsedCommand.args);
    } catch (error) {
      return {
        output: `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }

  getHistory(): IHistoryManager {
    return this.historyManager;
  }

  getCommandRegistry(): ICommandRegistry {
    return this.commandRegistry;
  }
}
