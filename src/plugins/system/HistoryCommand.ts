import {
  ICommand,
  CommandResult,
  IHistoryManager,
} from "@/core/interfaces/ICommand";

export class HistoryCommand implements ICommand {
  readonly id = "history";
  readonly description = "Display or manage command history";

  private readonly historyManager: IHistoryManager;

  constructor(historyManager: IHistoryManager) {
    this.historyManager = historyManager;
  }

  validate(args: string[]): boolean {
    if (args.length === 0) return true;

    if (args.length === 1) {
      return args[0] === "clear" || !isNaN(Number(args[0]));
    }

    return false;
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // No args - display all history
      if (args.length === 0) {
        const history = this.historyManager.getAll();
        if (history.length === 0) {
          return {
            output: "No history available",
            exitCode: 0,
          };
        }

        const output = history
          .map((cmd, index) => `${index + 1}  ${cmd}`)
          .join("\n");

        return {
          output,
          exitCode: 0,
        };
      }

      // Clear history
      if (args[0] === "clear") {
        this.historyManager.clear();
        return {
          output: "Command history cleared",
          exitCode: 0,
        };
      }

      // Display a specific number of entries
      const count = Number(args[0]);
      if (!isNaN(count)) {
        const history = this.historyManager.getAll();
        const start = Math.max(0, history.length - count);
        const entries = history.slice(start);

        if (entries.length === 0) {
          return {
            output: "No history available",
            exitCode: 0,
          };
        }

        const output = entries
          .map((cmd, index) => `${start + index + 1}  ${cmd}`)
          .join("\n");

        return {
          output,
          exitCode: 0,
        };
      }

      return {
        output: "Invalid arguments for history command",
        exitCode: 1,
      };
    } catch (error) {
      return {
        output: `history: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}
