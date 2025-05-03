// src/core/shell/WorkingDirectoryManager.ts
import { IWorkingDirectoryManager } from "../interfaces/IWorkingDirectory";
import { fs, path, BrowserFileSystem } from "../utils/BrowserFileSystem";

export class WorkingDirectoryManager implements IWorkingDirectoryManager {
  private currentDirectory: string;

  constructor(initialDirectory?: string) {
    // Start with virtual home directory or the specified initial directory
    this.currentDirectory = initialDirectory || "/home/user";
  }

  getCurrentDirectory(): string {
    return this.currentDirectory;
  }

  async setCurrentDirectory(newPath: string): Promise<boolean> {
    try {
      // Resolve the path (handle relative paths)
      const resolvedPath = this.resolvePath(newPath);

      // Check if the directory exists
      const stats = await fs.promises.stat(resolvedPath);

      if (!stats.isDirectory()) {
        throw new Error(`Not a directory: ${resolvedPath}`);
      }

      // Update the current directory
      this.currentDirectory = resolvedPath;

      // Also update the BrowserFileSystem's current directory
      BrowserFileSystem.setCurrentDir(resolvedPath);

      return true;
    } catch (error) {
      console.error(
        `Error changing directory: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  resolvePath(relativePath: string): string {
    // Special case for ~ (home directory)
    if (relativePath === "~" || relativePath.startsWith("~/")) {
      const homePath = "/home/user";
      return relativePath === "~"
        ? homePath
        : path.join(homePath, relativePath.substring(2));
    }

    // If the path is absolute, return it directly
    if (path.isAbsolute(relativePath)) {
      return path.normalize(relativePath);
    }

    // Otherwise, resolve it relative to the current directory
    return path.normalize(path.join(this.currentDirectory, relativePath));
  }
}
