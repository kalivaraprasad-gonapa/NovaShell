// src/core/completion/FileSystemCompletionProvider.ts
import {
  ITabCompletionProvider,
  CompletionMatch,
} from "../interfaces/ITabCompletion";
import { ICommandParser } from "../interfaces/ICommand";
import { IWorkingDirectoryManager } from "../interfaces/IWorkingDirectory";
import { fs, path } from "../utils/BrowserFileSystem";

export class FileSystemCompletionProvider implements ITabCompletionProvider {
  private readonly workingDirManager: IWorkingDirectoryManager;
  private readonly commandParser: ICommandParser;

  constructor(
    workingDirManager: IWorkingDirectoryManager,
    commandParser: ICommandParser,
  ) {
    this.workingDirManager = workingDirManager;
    this.commandParser = commandParser;
  }

  async getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]> {
    // Parse the command to get arguments
    const parsed = this.commandParser.parse(commandLine);

    // If there's no command, don't provide completions
    if (!parsed.commandName) {
      return [];
    }

    // Get the partial path from the current word at cursor
    const words = commandLine.substring(0, cursorPosition).split(" ");
    const currentWord = words[words.length - 1] || "";

    try {
      // Determine the directory to look in
      let dirPath: string;
      let baseName: string;

      if (path.isAbsolute(currentWord)) {
        // If an absolute path, use it directly
        dirPath = path.dirname(currentWord);
        baseName = path.basename(currentWord);
      } else if (currentWord.includes("/") || currentWord.includes("\\")) {
        // Relative path with subdirectories
        const resolvedPath = this.workingDirManager.resolvePath(
          path.dirname(currentWord),
        );
        dirPath = resolvedPath;
        baseName = path.basename(currentWord);
      } else {
        // Just a file name in the current directory
        dirPath = this.workingDirManager.getCurrentDirectory();
        baseName = currentWord;
      }

      // Read the directory
      const entries = await fs.promises.readdir(dirPath);

      // Filter entries that match the current input and convert to CompletionMatch[]
      const matches: CompletionMatch[] = entries
        .filter((entry) => entry.name.startsWith(baseName))
        .map((entry) => {
          const value = entry.isDirectory()
            ? path.join(path.dirname(currentWord), entry.name) + "/"
            : path.join(path.dirname(currentWord), entry.name);

          return {
            value,
            description: entry.isDirectory() ? "Directory" : "File",
            type: entry.isDirectory() ? "directory" : "file",
          } as CompletionMatch;
        });

      return matches;
    } catch (error) {
      console.error("Error getting file completions:", error);
      return [];
    }
  }
}
