// src/core/factory/ShellFactory.ts
import { CommandParser } from "../command/CommandParser";
import { CommandRegistry } from "../command/CommandRegistry";
import { HelpCommand } from "../command/HelpCommand";
import { PersistentHistoryManager } from "../history/PersistentHistoryManager";
import { IShellSession, IConfigProvider } from "../interfaces/ICommand";
import { ShellSession } from "../shell/ShellSession";
import { EnvironmentVariableManager } from "../shell/EnvironmentVariableManager";
import { WorkingDirectoryManager } from "../shell/WorkingDirectoryManager";
import { TabCompletionRegistry } from "../completion/TabCompletionRegistry";
import { CommandCompletionProvider } from "../completion/CommandCompletionProvider";
import { FileSystemCompletionProvider } from "../completion/FileSystemCompletionProvider";
import { HistoryCompletionProvider } from "../completion/HistoryCompletionProvider";
import { HistoryCommand } from "@/plugins/system/HistoryCommand";
import { TerminalConfig } from "@/config/providers/TerminalConfigProvider";

export class ShellFactory {
  static async createDefaultShell(
    terminalConfig?: IConfigProvider<TerminalConfig>,
  ): Promise<IShellSession> {
    // Get history size from config if available
    const historySize = terminalConfig
      ? (await terminalConfig.getConfig()).historySize
      : 1000;

    // Create core components
    const commandRegistry = new CommandRegistry();
    const historyManager = new PersistentHistoryManager(historySize);
    const commandParser = new CommandParser();
    const environmentManager = new EnvironmentVariableManager();
    const workingDirManager = new WorkingDirectoryManager();

    // Create tab completion registry and providers
    const tabCompletionRegistry = new TabCompletionRegistry();
    const commandCompletionProvider = new CommandCompletionProvider(
      commandRegistry,
      commandParser,
    );
    const fileSystemCompletionProvider = new FileSystemCompletionProvider(
      workingDirManager,
      commandParser,
    );
    const historyCompletionProvider = new HistoryCompletionProvider(
      historyManager,
    );

    // Register completion providers
    tabCompletionRegistry.registerProvider(commandCompletionProvider);
    tabCompletionRegistry.registerProvider(fileSystemCompletionProvider);
    tabCompletionRegistry.registerProvider(historyCompletionProvider);

    // Load command history from storage
    await historyManager.loadHistory();

    // Create shell session with all components
    const shellSession = new ShellSession(
      commandRegistry,
      historyManager,
      commandParser,
      environmentManager,
      workingDirManager,
      tabCompletionRegistry,
    );

    // Register built-in commands - only those that won't be registered by plugins
    commandRegistry.register(new HelpCommand(commandRegistry));
    commandRegistry.register(new HistoryCommand(historyManager));

    // Note: We're not registering commands like cd, ls, echo here
    // They will be registered by the plugins instead

    return shellSession;
  }
}
