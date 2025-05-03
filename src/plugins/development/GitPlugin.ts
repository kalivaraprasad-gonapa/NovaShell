import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class GitCommand implements ICommand {
  readonly id = "git";
  readonly description = "Git version control system";

  validate(args: string[]): boolean {
    return args.length > 0; // At least one argument is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Execute git command with all arguments
      const { stdout, stderr } = await execPromise(`git ${args.join(" ")}`);

      return {
        output: stdout || stderr,
        exitCode: stderr ? 1 : 0,
      };
    } catch (error) {
      return {
        output: `git: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}

export class GitPlugin extends BasePlugin {
  readonly id = "git";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [new GitCommand()];
}
