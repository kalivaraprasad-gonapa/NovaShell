// src/core/history/HistoryManager.ts
import { IHistoryManager } from "../interfaces/ICommand";

export class HistoryManager implements IHistoryManager {
  private readonly history: string[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  add(command: string): void {
    // Don't add empty commands
    if (!command.trim()) return;

    // Don't add duplicates of the last command
    if (
      this.history.length > 0 &&
      this.history[this.history.length - 1] === command
    ) {
      return;
    }

    this.history.push(command);

    // Trim if exceeds max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }

  get(index: number): string | undefined {
    return this.history[index];
  }

  search(term: string): ReadonlyArray<string> {
    const lowerTerm = term.toLowerCase();
    return this.history.filter((cmd) => cmd.toLowerCase().includes(lowerTerm));
  }

  getAll(): ReadonlyArray<string> {
    return [...this.history];
  }

  // Implement new methods required by updated interface

  async saveHistory(): Promise<boolean> {
    // Base implementation doesn't save history persistently
    return true;
  }

  async loadHistory(): Promise<boolean> {
    // Base implementation doesn't load history persistently
    return true;
  }

  clear(): void {
    // Clear the history
    this.history.length = 0;
  }
}
