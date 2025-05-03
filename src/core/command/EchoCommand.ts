import { CommandResult, ICommand } from "../interfaces/ICommand";

export class EchoCommand implements ICommand {
  readonly id = "echo";
  readonly description = "Display a line of text";

  validate(args: string[]): boolean {
    return true; // Echo accepts any arguments
  }

  async execute(args: string[]): Promise<CommandResult> {
    return {
      output: args.join(" "),
      exitCode: 0,
    };
  }
}
