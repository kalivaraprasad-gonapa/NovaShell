import { CommandParser } from "../command/CommandParser";
import { CommandRegistry } from "../command/CommandRegistry";
import { EchoCommand } from "../command/EchoCommand";
import { HelpCommand } from "../command/HelpCommand";
import { HistoryManager } from "../history/HistoryManager";
import { IShellSession } from "../interfaces/ICommand";
import { ShellSession } from "../shell/ShellSession";

export class ShellFactory {
  static createDefaultShell(): IShellSession {
    const commandRegistry = new CommandRegistry();
    const historyManager = new HistoryManager();
    const commandParser = new CommandParser();

    const shellSession = new ShellSession(
      commandRegistry,
      historyManager,
      commandParser,
    );

    // Register built-in commands
    commandRegistry.register(new EchoCommand());
    commandRegistry.register(new HelpCommand(commandRegistry));

    return shellSession;
  }
}
