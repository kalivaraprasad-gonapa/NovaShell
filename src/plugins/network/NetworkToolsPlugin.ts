// plugins/network/NetworkToolsPlugin.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class PingCommand implements ICommand {
  readonly id = "ping";
  readonly description = "Send ICMP ECHO_REQUEST to network hosts";

  validate(args: string[]): boolean {
    return args.length === 1; // Exactly one host is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    const host = args[0];

    try {
      // Run ping command with 4 packets
      const { stdout, stderr } = await execPromise(`ping -c 4 ${host}`);

      if (stderr) {
        return {
          output: stderr,
          exitCode: 1,
        };
      }

      return {
        output: stdout,
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `ping: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}

class FetchCommand implements ICommand {
  readonly id = "fetch";
  readonly description = "Fetch content from URLs";

  validate(args: string[]): boolean {
    return args.length === 1 && args[0].startsWith("http"); // One URL is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    const url = args[0];

    try {
      // Use fetch API to get content
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`,
        );
      }

      const content = await response.text();

      return {
        output: content,
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: `fetch: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
      };
    }
  }
}

export class NetworkToolsPlugin extends BasePlugin {
  readonly id = "network-tools";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [
    new PingCommand(),
    new FetchCommand(),
  ];
}
