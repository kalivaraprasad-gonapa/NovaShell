// src/plugins/system-shell/SystemShellPlugin.ts
import { BasePlugin } from "../base/BasePlugin";
import {
  ICommand,
  CommandResult,
  IShellSession,
} from "@/core/interfaces/ICommand";

// Mock system shell command for browser environment
class BrowserSystemShellCommand implements ICommand {
  readonly id = "system-command";
  readonly description =
    "Simulates executing a command in the system shell (browser environment)";
  private shellSession?: IShellSession;

  constructor(shellSession?: IShellSession) {
    this.shellSession = shellSession;
  }

  setShellSession(shellSession: IShellSession): void {
    this.shellSession = shellSession;
  }

  validate(_args: string[]): boolean {
    // All system commands are considered valid
    return true;
  }

  async execute(args: string[]): Promise<CommandResult> {
    // Get the full command line including arguments
    const commandLine = args.join(" ");

    // In a browser, we can't actually execute system commands
    // But we can provide a simulated response
    return {
      output: `Note: In browser environment, system commands cannot be executed directly.\nCommand simulated: ${commandLine}\n\nFor full system shell integration, use NovaShell in a Node.js environment.`,
      exitCode: 0,
      metadata: {
        isSystemCommand: true,
        shell: "Browser Environment",
        simulated: true,
      },
    };
  }
}

// The fallback command handles any command not found in the registry
class BrowserFallbackCommand implements ICommand {
  readonly id = "fallback";
  readonly description = "Handles commands not found in the registry";
  private readonly systemCommand: BrowserSystemShellCommand;
  private shellSession?: IShellSession;

  constructor(systemCommand: BrowserSystemShellCommand) {
    this.systemCommand = systemCommand;
  }

  setShellSession(shellSession: IShellSession): void {
    this.shellSession = shellSession;
    this.systemCommand.setShellSession(shellSession);
  }

  validate(_args: string[]): boolean {
    return true;
  }

  async execute(args: string[]): Promise<CommandResult> {
    // The first arg is the command name, the rest are arguments
    const commandName = args[0];
    const commandArgs = args.slice(1);

    // Check if the shellSession exists
    if (!this.shellSession) {
      return {
        output: `Cannot execute command: Shell session not initialized`,
        exitCode: 1,
      };
    }

    // Check if the command exists in the registry
    const registry = this.shellSession.getCommandRegistry();
    const command = registry.getCommand(commandName);

    if (command) {
      // If the command exists in the registry, execute it
      return command.execute(commandArgs);
    } else {
      // If not, pass it to the system shell
      return this.systemCommand.execute(args);
    }
  }
}

// Browser-compatible plugin that provides system shell simulation
export class SystemShellPlugin extends BasePlugin {
  readonly id = "system-shell";
  readonly version = "1.0.0";

  private readonly systemCommand: BrowserSystemShellCommand;
  private readonly fallbackCommand: BrowserFallbackCommand;
  private _commands: ICommand[];

  constructor() {
    super();
    this.systemCommand = new BrowserSystemShellCommand();
    this.fallbackCommand = new BrowserFallbackCommand(this.systemCommand);
    this._commands = [this.systemCommand, this.fallbackCommand];
  }

  get commands(): ReadonlyArray<ICommand> {
    return this._commands;
  }

  protected async onInitialize(): Promise<void> {
    if (this.shellSession) {
      // Set the shell session on the commands
      this.systemCommand.setShellSession(this.shellSession);
      this.fallbackCommand.setShellSession(this.shellSession);

      // Make the fallback command the default handler for unknown commands
      if ("setFallbackCommand" in this.shellSession) {
        (this.shellSession as any).setFallbackCommand(this.fallbackCommand);
      } else {
        console.warn(
          "ShellSession does not support fallback commands. System shell integration will be limited.",
        );
      }
    }
  }
}
