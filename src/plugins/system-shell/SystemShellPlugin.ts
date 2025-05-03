// src/plugins/system-shell/SystemShellPlugin.ts
import { BasePlugin } from "../base/BasePlugin";
import {
  ICommand,
  CommandResult,
  IShellSession,
} from "@/core/interfaces/ICommand";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// This command will handle any command not found in the registry
// by passing it to the system shell
class SystemShellCommand implements ICommand {
  readonly id = "system-command";
  readonly description = "Executes a command in the system shell";
  private shellSession?: IShellSession;

  constructor(shellSession?: IShellSession) {
    this.shellSession = shellSession;
  }

  setShellSession(shellSession: IShellSession): void {
    this.shellSession = shellSession;
  }

  validate(_args: string[]): boolean {
    // All system commands are considered valid since we don't know in advance
    return true;
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Get the full command line including arguments
      const commandLine = args.join(" ");

      // Detect the system shell based on the platform
      const shell =
        process.platform === "win32" ? "powershell.exe" : "/bin/bash";
      const shellFlag = process.platform === "win32" ? "-Command" : "-c";

      // Execute the command using the system shell
      const { stdout, stderr } = await execPromise(
        `${shell} ${shellFlag} "${commandLine}"`,
      );

      // Return the result
      return {
        output: stdout || stderr,
        exitCode: stderr ? 1 : 0,
        metadata: {
          isSystemCommand: true,
          shell: process.platform === "win32" ? "PowerShell" : "Bash",
        },
      };
    } catch (error: any) {
      return {
        output: `Error executing system command: ${error.message}`,
        exitCode: 1,
        metadata: {
          isSystemCommand: true,
          error: true,
        },
      };
    }
  }
}

// The fallback command handles any command not found in the registry
class FallbackCommand implements ICommand {
  readonly id = "fallback";
  readonly description = "Handles commands not found in the registry";
  private readonly systemCommand: SystemShellCommand;
  private shellSession?: IShellSession;

  constructor(systemCommand: SystemShellCommand) {
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

// The plugin that provides system shell integration
export class SystemShellPlugin extends BasePlugin {
  readonly id = "system-shell";
  readonly version = "1.0.0";

  private readonly systemCommand: SystemShellCommand;
  private readonly fallbackCommand: FallbackCommand;
  private _commands: ICommand[];

  constructor() {
    super();
    this.systemCommand = new SystemShellCommand();
    this.fallbackCommand = new FallbackCommand(this.systemCommand);
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
