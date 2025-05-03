// src/core/shell/ShellSession.ts
import {
  CommandResult,
  ICommand,
  ICommandParser,
  ICommandRegistry,
  IHistoryManager,
  IShellSession,
} from "../interfaces/ICommand";
import { IEnvironmentVariableManager } from "../interfaces/IEnvironment";
import { IWorkingDirectoryManager } from "../interfaces/IWorkingDirectory";
import { ITabCompletionRegistry } from "../interfaces/ITabCompletion";
import { EnvironmentVariableManager } from "./EnvironmentVariableManager";
import { WorkingDirectoryManager } from "./WorkingDirectoryManager";
import { TabCompletionRegistry } from "../completion/TabCompletionRegistry";

export class ShellSession implements IShellSession {
  private readonly commandRegistry: ICommandRegistry;
  private readonly historyManager: IHistoryManager;
  private readonly commandParser: ICommandParser;
  private readonly environmentManager: IEnvironmentVariableManager;
  private readonly workingDirManager: IWorkingDirectoryManager;
  private readonly tabCompletionRegistry: ITabCompletionRegistry;
  private fallbackCommand?: ICommand;

  constructor(
    commandRegistry: ICommandRegistry,
    historyManager: IHistoryManager,
    commandParser: ICommandParser,
    environmentManager: IEnvironmentVariableManager = new EnvironmentVariableManager(),
    workingDirManager: IWorkingDirectoryManager = new WorkingDirectoryManager(),
    tabCompletionRegistry: ITabCompletionRegistry = new TabCompletionRegistry(),
  ) {
    this.commandRegistry = commandRegistry;
    this.historyManager = historyManager;
    this.commandParser = commandParser;
    this.environmentManager = environmentManager;
    this.workingDirManager = workingDirManager;
    this.tabCompletionRegistry = tabCompletionRegistry;
  }

  // Getter methods for all components
  public setFallbackCommand(command: ICommand): void {
    this.fallbackCommand = command;
  }

  getEnvironmentManager(): IEnvironmentVariableManager {
    return this.environmentManager;
  }

  getWorkingDirectoryManager(): IWorkingDirectoryManager {
    return this.workingDirManager;
  }

  getTabCompletionRegistry(): ITabCompletionRegistry {
    return this.tabCompletionRegistry;
  }

  async executeCommand(commandLine: string): Promise<CommandResult> {
    // First, expand any environment variables in the command line
    const expandedCommandLine =
      this.environmentManager.expandVariables(commandLine);

    this.historyManager.add(commandLine); // Still store the original command

    const parsedCommand = this.commandParser.parse(expandedCommandLine);

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
