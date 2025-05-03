import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { IWorkingDirectoryManager } from "@/core/interfaces/IWorkingDirectory";
import { fs } from "@/core/utils/BrowserFileSystem";

export class LsCommand implements ICommand {
  readonly id = "ls";
  readonly description = "List directory contents";

  private readonly workingDirManager: IWorkingDirectoryManager;

  constructor(workingDirManager: IWorkingDirectoryManager) {
    this.workingDirManager = workingDirManager;
  }

  validate(args: string[]): boolean {
    return args.length <= 1; // Accept 0 or 1 argument (directory path)
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      const dirPath = args[0] || ".";
      const resolvedPath = this.workingDirManager.resolvePath(dirPath);

      const entries = await fs.promises.readdir(resolvedPath);

      // Format the output
      const output = entries
        .map((entry) => {
          const prefix = entry.isDirectory() ? "d" : "-";
          const nameStr = entry.isDirectory() ? `${entry.name}/` : entry.name;
          return `${prefix} ${nameStr}`;
        })
        .join("\n");

      return {
        output: output || "(empty directory)",
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `ls: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}
