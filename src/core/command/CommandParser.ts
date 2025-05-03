// core/command/CommandParser.ts

import { ICommandParser, ParsedCommand } from "../interfaces/ICommand";

export class CommandParser implements ICommandParser {
  parse(commandLine: string): ParsedCommand {
    // Simple implementation - split by spaces
    // In a real implementation, handle quotes, escapes, etc.
    const trimmed = commandLine.trim();
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0] || "";
    const args = parts.slice(1);

    return {
      commandName,
      args,
      rawInput: commandLine,
    };
  }
}
