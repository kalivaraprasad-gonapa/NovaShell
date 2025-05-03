import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { IWorkingDirectoryManager } from "@/core/interfaces/IWorkingDirectory";
import { fs } from "@/core/utils/BrowserFileSystem";

export class CatCommand implements ICommand {
  readonly id = "cat";
  readonly description = "Concatenate files and print on the standard output";

  private readonly workingDirManager: IWorkingDirectoryManager;

  constructor(workingDirManager: IWorkingDirectoryManager) {
    this.workingDirManager = workingDirManager;
  }

  validate(args: string[]): boolean {
    return args.length > 0; // At least one file path is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Read and concatenate all files
      const fileContents = await Promise.all(
        args.map(async (filePath) => {
          try {
            const resolvedPath = this.workingDirManager.resolvePath(filePath);
            const content = await fs.promises.readFile(resolvedPath, {
              encoding: "utf8",
            });
            return content;
          } catch (error) {
            // Return error message for this file
            return `cat: ${filePath}: ${error instanceof Error ? error.message : String(error)}`;
          }
        }),
      );

      return {
        output: fileContents.join("\n"),
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `cat: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}
