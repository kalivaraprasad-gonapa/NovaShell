import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";
import path from "path";
import fs from "fs/promises";

class LsCommand implements ICommand {
  readonly id = "ls";
  readonly description = "List directory contents";

  validate(args: string[]): boolean {
    return args.length <= 1; // Accept 0 or 1 argument (directory path)
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      const dirPath = args[0] || ".";
      const files = await fs.readdir(dirPath);

      // Get file stats for each file (for display formatting)
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            mtime: stats.mtime,
          };
        }),
      );

      // Format the output
      const output = fileStats
        .map((file) => {
          const prefix = file.isDirectory ? "d" : "-";
          const sizeStr = String(file.size).padStart(8, " ");
          const dateStr = file.mtime.toLocaleDateString();
          const nameStr = file.isDirectory ? `${file.name}/` : file.name;
          return `${prefix} ${sizeStr} ${dateStr} ${nameStr}`;
        })
        .join("\n");

      return {
        output,
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

class CatCommand implements ICommand {
  readonly id = "cat";
  readonly description = "Concatenate files and print on the standard output";

  validate(args: string[]): boolean {
    return args.length > 0; // At least one file path is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Read and concatenate all files
      const fileContents = await Promise.all(
        args.map(async (filePath) => {
          try {
            const content = await fs.readFile(filePath, "utf-8");
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

class MkdirCommand implements ICommand {
  readonly id = "mkdir";
  readonly description = "Create directories";

  validate(args: string[]): boolean {
    return args.length > 0; // At least one directory path is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Create all directories
      await Promise.all(
        args.map(async (dirPath) => {
          try {
            await fs.mkdir(dirPath, { recursive: true });
            return null;
          } catch (error) {
            throw new Error(
              `${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }),
      );

      return {
        output: "",
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `mkdir: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}

export class FileSystemPlugin extends BasePlugin {
  readonly id = "file-system";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [
    new LsCommand(),
    new CatCommand(),
    new MkdirCommand(),
  ];
}
