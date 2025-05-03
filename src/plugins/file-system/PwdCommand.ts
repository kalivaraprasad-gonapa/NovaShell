import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { IWorkingDirectoryManager } from "@/core/interfaces/IWorkingDirectory";

export class PwdCommand implements ICommand {
  readonly id = "pwd";
  readonly description = "Print the current working directory";

  private readonly workingDirManager: IWorkingDirectoryManager;

  constructor(workingDirManager: IWorkingDirectoryManager) {
    this.workingDirManager = workingDirManager;
  }

  validate(args: string[]): boolean {
    return args.length === 0; // No arguments allowed
  }

  async execute(_args: string[]): Promise<CommandResult> {
    return {
      output: this.workingDirManager.getCurrentDirectory(),
      exitCode: 0,
    };
  }
}
