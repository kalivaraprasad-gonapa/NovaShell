// src/core/utils/BrowserFileSystem.ts
// Browser-compatible file system utilities

// Mock directory entries for browser environment
export interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

// Browser file system utility class
class BrowserFileSystem {
  // Mock current directory - in browser, we start at a virtual root
  private static currentDir = "/";

  // Mock file system structure for browser environment
  private static virtualFS: Record<
    string,
    {
      isDirectory: boolean;
      content?: string;
      children?: string[];
    }
  > = {
    "/": {
      isDirectory: true,
      children: ["/home", "/tmp", "/usr"],
    },
    "/home": {
      isDirectory: true,
      children: ["/home/user"],
    },
    "/home/user": {
      isDirectory: true,
      children: ["/home/user/documents", "/home/user/downloads"],
    },
    "/home/user/documents": {
      isDirectory: true,
      children: ["/home/user/documents/readme.txt"],
    },
    "/home/user/documents/readme.txt": {
      isDirectory: false,
      content: "This is a virtual file system for NovaShell.",
    },
    "/home/user/downloads": {
      isDirectory: true,
      children: [],
    },
    "/tmp": {
      isDirectory: true,
      children: [],
    },
    "/usr": {
      isDirectory: true,
      children: ["/usr/bin"],
    },
    "/usr/bin": {
      isDirectory: true,
      children: [],
    },
  };

  // Get current directory
  static getCurrentDir(): string {
    return this.currentDir;
  }

  // Set current directory
  static setCurrentDir(path: string): boolean {
    // Resolve path first
    const resolvedPath = this.resolvePath(path);

    // Check if path exists and is a directory
    const entry = this.virtualFS[resolvedPath];
    if (!entry || !entry.isDirectory) {
      return false;
    }

    this.currentDir = resolvedPath;
    return true;
  }

  // Read directory contents
  static async readdir(dirPath: string): Promise<DirectoryEntry[]> {
    const path = this.resolvePath(dirPath);
    const entry = this.virtualFS[path];

    if (!entry || !entry.isDirectory) {
      throw new Error(`ENOENT: no such directory '${dirPath}'`);
    }

    const children = entry.children || [];
    return children.map((childPath) => {
      const childEntry = this.virtualFS[childPath];
      const name = childPath.split("/").pop() || "";

      return {
        name,
        isDirectory: () => childEntry?.isDirectory || false,
        isFile: () => !childEntry?.isDirectory,
      };
    });
  }

  // Read file contents
  static async readFile(
    filePath: string,
    options?: { encoding?: string },
  ): Promise<string | Uint8Array> {
    const path = this.resolvePath(filePath);
    const entry = this.virtualFS[path];

    if (!entry) {
      throw new Error(`ENOENT: no such file '${filePath}'`);
    }

    if (entry.isDirectory) {
      throw new Error(`EISDIR: illegal operation on a directory '${filePath}'`);
    }

    const content = entry.content || "";

    if (options?.encoding === "utf8" || options?.encoding === "utf-8") {
      return content;
    }

    // Convert to Uint8Array if no encoding is specified
    const encoder = new TextEncoder();
    return encoder.encode(content);
  }

  // Check if path exists and get stats
  static async stat(
    path: string,
  ): Promise<{ isDirectory: () => boolean; isFile: () => boolean }> {
    const resolvedPath = this.resolvePath(path);
    const entry = this.virtualFS[resolvedPath];

    if (!entry) {
      throw new Error(`ENOENT: no such file or directory '${path}'`);
    }

    return {
      isDirectory: () => entry.isDirectory,
      isFile: () => !entry.isDirectory,
    };
  }

  // Resolve path (handle relative paths)
  static resolvePath(relativePath: string): string {
    // If path is absolute, return it normalized
    if (relativePath.startsWith("/")) {
      return this.normalizePath(relativePath);
    }

    // If path is relative, resolve it against current directory
    let current = this.currentDir;
    if (!current.endsWith("/")) {
      current += "/";
    }

    return this.normalizePath(current + relativePath);
  }

  // Normalize path (resolve . and .. segments)
  private static normalizePath(path: string): string {
    const segments = path.split("/").filter(Boolean);
    const result: string[] = [];

    for (const segment of segments) {
      if (segment === ".") {
        continue;
      } else if (segment === "..") {
        result.pop();
      } else {
        result.push(segment);
      }
    }

    return "/" + result.join("/");
  }

  // Path utilities for browser
  static join(...paths: string[]): string {
    return paths.join("/").replace(/\/+/g, "/");
  }

  static dirname(path: string): string {
    const segments = path.split("/").filter(Boolean);
    segments.pop();
    return "/" + segments.join("/");
  }

  static basename(path: string): string {
    return path.split("/").filter(Boolean).pop() || "";
  }
}

// Export path utilities for easy use
export const path = {
  join: BrowserFileSystem.join,
  dirname: BrowserFileSystem.dirname,
  basename: BrowserFileSystem.basename,
  isAbsolute: (path: string) => path.startsWith("/"),
  normalize: (path: string) => BrowserFileSystem.resolvePath(path),
};

// Export fs utilities for easy use
export const fs = {
  readdir: BrowserFileSystem.readdir.bind(BrowserFileSystem),
  readFile: BrowserFileSystem.readFile.bind(BrowserFileSystem),
  stat: BrowserFileSystem.stat.bind(BrowserFileSystem),
  promises: {
    readdir: BrowserFileSystem.readdir.bind(BrowserFileSystem),
    readFile: BrowserFileSystem.readFile.bind(BrowserFileSystem),
    stat: BrowserFileSystem.stat.bind(BrowserFileSystem),
  },
};

// Export the BrowserFileSystem class for direct access
export { BrowserFileSystem };
