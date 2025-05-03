// src/plugins/system/EchoExpandCommand.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { IEnvironmentVariableManager } from "@/core/interfaces/IEnvironment";

export class EchoExpandCommand implements ICommand {
  readonly id = "echo";
  readonly description =
    "Display a line of text with environment variable expansion";

  private readonly envManager: IEnvironmentVariableManager;

  constructor(envManager: IEnvironmentVariableManager) {
    this.envManager = envManager;
  }

  validate(args: string[]): boolean {
    return true; // Echo accepts any arguments
  }

  async execute(args: string[]): Promise<CommandResult> {
    const text = args.join(" ");
    const expanded = this.envManager.expandVariables(text);

    return {
      output: expanded,
      exitCode: 0,
    };
  }
}
