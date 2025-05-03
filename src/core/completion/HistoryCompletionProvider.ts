// src/core/completion/HistoryCompletionProvider.ts
import {
  ITabCompletionProvider,
  CompletionMatch,
} from "../interfaces/ITabCompletion";
import { IHistoryManager } from "../interfaces/ICommand";

export class HistoryCompletionProvider implements ITabCompletionProvider {
  private readonly historyManager: IHistoryManager;

  constructor(historyManager: IHistoryManager) {
    this.historyManager = historyManager;
  }

  async getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]> {
    // Only provide completions if the command line is a prefix of previous commands
    if (!commandLine.trim()) {
      return [];
    }

    // Search history for matches
    const matches: CompletionMatch[] = this.historyManager
      .getAll()
      .filter((cmd) => cmd.startsWith(commandLine))
      // Remove duplicates and keep most recent
      .filter((cmd, index, self) => self.indexOf(cmd) === index)
      .slice(-10) // Limit the number of suggestions
      .map((cmd) => ({
        value: cmd,
        description: "History",
        type: "command",
      }));

    return matches;
  }
}
