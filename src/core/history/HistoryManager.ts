import { IHistoryManager } from "../interfaces/ICommand";

// core/history/HistoryManager.ts
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
}
