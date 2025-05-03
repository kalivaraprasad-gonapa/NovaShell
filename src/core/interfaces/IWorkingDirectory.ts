// src/core/interfaces/IWorkingDirectory.ts
import { IShellSession } from "./ICommand";

export interface IWorkingDirectoryManager {
  getCurrentDirectory(): string;
  setCurrentDirectory(path: string): Promise<boolean>;
  resolvePath(relativePath: string): string;
}
