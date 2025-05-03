import {
  ICommand,
  CommandResult,
  IShellSession,
} from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";
import { IWorkingDirectoryManager } from "@/core/interfaces/IWorkingDirectory";
import { WorkingDirectoryManager } from "@/core/shell/WorkingDirectoryManager";
import { CdCommand } from "./CdCommand";
import { LsCommand } from "./LsCommand";
import { CatCommand } from "./CatCommand";
import { PwdCommand } from "./PwdCommand";
import { path } from "@/core/utils/BrowserFileSystem";

export class FileSystemPlugin extends BasePlugin {
  readonly id = "file-system";
  readonly version = "1.0.0";
  private readonly workingDirManager: IWorkingDirectoryManager;
  private _commands: ICommand[];

  constructor(workingDirManager?: IWorkingDirectoryManager) {
    super();
    // Create a new manager if one isn't provided
    this.workingDirManager = workingDirManager || new WorkingDirectoryManager();

    // Initialize commands with the working directory manager
    this._commands = [
      new CdCommand(this.workingDirManager),
      new LsCommand(this.workingDirManager),
      new CatCommand(this.workingDirManager),
      new PwdCommand(this.workingDirManager),
    ];
  }

  get commands(): ReadonlyArray<ICommand> {
    return this._commands;
  }

  getWorkingDirectoryManager(): IWorkingDirectoryManager {
    return this.workingDirManager;
  }

  // Method to update the prompt to show current directory
  getCurrentPrompt(): string {
    const currentDir = this.workingDirManager.getCurrentDirectory();
    // Get just the name of the current directory
    const dirName = currentDir.split("/").pop() || currentDir;
    return `${dirName}$`;
  }
}
