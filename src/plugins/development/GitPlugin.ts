// src/plugins/development/GitPlugin.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";

// Mock Git implementation for browser environment
class BrowserGitCommand implements ICommand {
  readonly id = "git";
  readonly description =
    "Git version control system (limited functionality in browser)";

  // Simple mock responses for common git commands
  private readonly mockResponses: Record<string, string> = {
    status:
      "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
    log: "commit abc1234def5678 (HEAD -> main, origin/main)\nAuthor: NovaShell User <user@example.com>\nDate:   Sat May 03 2025 12:34:56\n\n    Initial commit",
    branch: "* main",
    version: "git version 2.30.0 (NovaShell Browser Emulation)",
    help: "usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]\n           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]\n           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]\n           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]\n           <command> [<args>]",
  };

  validate(args: string[]): boolean {
    return args.length > 0; // At least one argument is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    const subcommand = args[0];

    // Check if we have a mock response for this subcommand
    if (this.mockResponses[subcommand]) {
      return {
        output: this.mockResponses[subcommand],
        exitCode: 0,
      };
    }

    // For unknown subcommands, provide a helpful message
    return {
      output: `This is a limited git emulation in the browser environment.\nSupported commands: ${Object.keys(this.mockResponses).join(", ")}\n\nFor full git functionality, please use NovaShell in a Node.js environment.`,
      exitCode: 1,
    };
  }
}

export class GitPlugin extends BasePlugin {
  readonly id = "git";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [new BrowserGitCommand()];
}
