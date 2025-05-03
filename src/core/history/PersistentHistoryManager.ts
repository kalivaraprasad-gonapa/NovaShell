import { IHistoryManager } from "../interfaces/ICommand";

export class PersistentHistoryManager implements IHistoryManager {
  private history: string[] = [];
  private readonly maxSize: number;
  private readonly storageKey: string;

  constructor(maxSize = 1000, storageKey = "novashell:command-history") {
    this.maxSize = maxSize;
    this.storageKey = storageKey;
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

    // Auto-save after adding
    this.saveHistory().catch((err) =>
      console.error("Failed to save history:", err),
    );
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

  clear(): void {
    this.history = [];
    this.saveHistory().catch((err) =>
      console.error("Failed to save history:", err),
    );
  }

  async saveHistory(): Promise<boolean> {
    if (typeof window === "undefined") {
      return false; // Not in browser environment
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
      return true;
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.error("Storage quota exceeded while trying to save history.");
        // Optionally, implement logic to manage quota exceedance here,
        // for example, by clearing older history items or notifying the user.
      } else {
        console.error("Failed to save command history:", error);
      }
      return false;
    }
  }

  async loadHistory(): Promise<boolean> {
    if (typeof window === "undefined") {
      return false; // Not in browser environment
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.history = JSON.parse(saved);
        // Ensure we don't exceed max size
        if (this.history.length > this.maxSize) {
          this.history = this.history.slice(-this.maxSize);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load command history:", error);
      return false;
    }
  }
}
