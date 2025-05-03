// src/plugins/network/NetworkToolsPlugin.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";

// Browser-compatible ping command
class BrowserPingCommand implements ICommand {
  readonly id = "ping";
  readonly description =
    "Simulate pinging network hosts in browser environment";

  validate(args: string[]): boolean {
    return args.length === 1; // Exactly one host is required
  }

  async execute(args: string[]): Promise<CommandResult> {
    const host = args[0];

    if (!host) {
      return {
        output: "Usage: ping <hostname>",
        exitCode: 1,
      };
    }

    // Generate simulated ping response
    const pingTime = Math.floor(Math.random() * 100) + 5; // 5-105ms
    const output =
      `PING ${host} (${this.generateRandomIp()}) 56(84) bytes of data.\n` +
      `64 bytes from ${host} (${this.generateRandomIp()}): icmp_seq=1 ttl=54 time=${pingTime}.${Math.floor(Math.random() * 1000)} ms\n` +
      `64 bytes from ${host} (${this.generateRandomIp()}): icmp_seq=2 ttl=54 time=${pingTime + Math.floor(Math.random() * 10) - 5}.${Math.floor(Math.random() * 1000)} ms\n` +
      `64 bytes from ${host} (${this.generateRandomIp()}): icmp_seq=3 ttl=54 time=${pingTime + Math.floor(Math.random() * 10) - 5}.${Math.floor(Math.random() * 1000)} ms\n` +
      `64 bytes from ${host} (${this.generateRandomIp()}): icmp_seq=4 ttl=54 time=${pingTime + Math.floor(Math.random() * 10) - 5}.${Math.floor(Math.random() * 1000)} ms\n\n` +
      `--- ${host} ping statistics ---\n` +
      `4 packets transmitted, 4 received, 0% packet loss, time ${Math.floor(Math.random() * 10) + 3}ms\n` +
      `rtt min/avg/max/mdev = ${pingTime - 5}.${Math.floor(Math.random() * 100)}/${pingTime}.${Math.floor(Math.random() * 100)}/${pingTime + 5}.${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 100)} ms`;

    return {
      output,
      exitCode: 0,
    };
  }

  // Helper to generate random IP for simulation
  private generateRandomIp(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }
}

// Real fetch command using browser's fetch API
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
    new BrowserPingCommand(),
    new FetchCommand(),
  ];
}
