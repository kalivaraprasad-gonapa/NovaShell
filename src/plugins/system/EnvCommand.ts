// src/plugins/system/EnvCommand.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { IEnvironmentVariableManager } from "@/core/interfaces/IEnvironment";

export class EnvCommand implements ICommand {
  readonly id = "env";
  readonly description = "Display, set or delete environment variables";

  private readonly envManager: IEnvironmentVariableManager;

  constructor(envManager: IEnvironmentVariableManager) {
    this.envManager = envManager;
  }

  validate(args: string[]): boolean {
    // Valid formats:
    // env                  - display all variables
    // env NAME             - display value of NAME
    // env NAME=VALUE       - set NAME to VALUE
    // env -u NAME          - unset NAME
    return args.length <= 2;
  }

  async execute(args: string[]): Promise<CommandResult> {
    try {
      // Display all variables
      if (args.length === 0) {
        const allVars = this.envManager.getAllVariables();
        const output = Object.entries(allVars)
          .map(([name, value]) => `${name}=${value}`)
          .join("\n");

        return {
          output: output || "(no environment variables set)",
          exitCode: 0,
        };
      }

      // Unset a variable
      if (args[0] === "-u" && args.length === 2) {
        const name = args[1];
        const result = this.envManager.deleteVariable(name);
        return {
          output: result ? "" : `env: ${name}: No such variable`,
          exitCode: result ? 0 : 1,
        };
      }

      // Check for NAME=VALUE format
      const assignmentMatch = args[0].match(/^(\w+)=(.*)$/);
      if (assignmentMatch) {
        const [, name, value] = assignmentMatch;
        this.envManager.setVariable(name, value);
        return {
          output: "",
          exitCode: 0,
        };
      }

      // Display a specific variable
      const name = args[0];
      const value = this.envManager.getVariable(name);
      if (value === undefined) {
        return {
          output: `env: ${name}: No such variable`,
          exitCode: 1,
        };
      }

      return {
        output: value,
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `env: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}
