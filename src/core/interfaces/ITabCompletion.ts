// src/core/interfaces/ITabCompletion.ts
export interface CompletionMatch {
  value: string;
  description?: string;
  type?: "command" | "file" | "directory" | "argument" | "option";
}

export interface ITabCompletionProvider {
  getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]>;
}

export interface ITabCompletionRegistry {
  registerProvider(provider: ITabCompletionProvider): void;
  unregisterProvider(provider: ITabCompletionProvider): void;
  getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]>;
}
