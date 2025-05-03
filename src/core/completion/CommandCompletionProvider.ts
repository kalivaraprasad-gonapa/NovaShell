// src/core/completion/CommandCompletionProvider.ts
import {
  ITabCompletionProvider,
  CompletionMatch,
} from "../interfaces/ITabCompletion";
import { ICommandRegistry, ICommandParser } from "../interfaces/ICommand";

export class CommandCompletionProvider implements ITabCompletionProvider {
  private readonly commandRegistry: ICommandRegistry;
  private readonly commandParser: ICommandParser;

  constructor(
    commandRegistry: ICommandRegistry,
    commandParser: ICommandParser,
  ) {
    this.commandRegistry = commandRegistry;
    this.commandParser = commandParser;
  }

  async getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]> {
    // Only complete commands at the beginning of the input
    const trimmedLine = commandLine.trim();

    // If the cursor isn't at the start of a word, don't provide completions
    if (trimmedLine.includes(" ")) {
      return [];
    }

    // Get all commands
    const commands = this.commandRegistry.getAllCommands();

    // Filter commands that match the current input
    const matches: CompletionMatch[] = commands
      .filter((cmd) => cmd.id.startsWith(trimmedLine))
      .map((cmd) => ({
        value: cmd.id,
        description: cmd.description,
        type: "command",
      }));

    return matches;
  }
}
