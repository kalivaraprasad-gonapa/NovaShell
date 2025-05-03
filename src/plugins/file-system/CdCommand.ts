// src/plugins/file-system/CdCommand.ts
import { ICommand, CommandResult } from "../../core/interfaces/ICommand";
import { IWorkingDirectoryManager } from "../../core/interfaces/IWorkingDirectory";

export class CdCommand implements ICommand {
  readonly id = "cd";
  readonly description = "Change the current directory";

  private readonly workingDirManager: IWorkingDirectoryManager;

  constructor(workingDirManager: IWorkingDirectoryManager) {
    this.workingDirManager = workingDirManager;
  }

  validate(args: string[]): boolean {
    return args.length <= 1; // Accept 0 or 1 argument (directory path)
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Default to home directory if no args
      const targetDir = args[0] || "~";

      const success =
        await this.workingDirManager.setCurrentDirectory(targetDir);

      if (!success) {
        return {
          output: `cd: ${targetDir}: No such file or directory`,
          exitCode: 1,
        };
      }

      return {
        output: "", // cd typically produces no output on success
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `cd: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}
