// src/plugins/system/SystemInfoPlugin.ts
import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";

// Browser-compatible uptime command
class BrowserUptimeCommand implements ICommand {
  readonly id = "uptime";
  readonly description = "Show how long the browser has been running";
  private startTime: number;

  constructor() {
    // Record page load time for simulating uptime
    this.startTime = Date.now();
  }

  validate(args: string[]): boolean {
    return args.length === 0; // No arguments allowed
  }

  async execute(_args: string[]): Promise<CommandResult> {
    const uptime = (Date.now() - this.startTime) / 1000; // in seconds
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);

    const formattedUptime = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    // Simulate load average values
    const loadAvg = [
      (Math.random() * 2).toFixed(2),
      (Math.random() * 1.5).toFixed(2),
      (Math.random() * 1).toFixed(2),
    ].join(", ");

    return {
      output: `Uptime: ${formattedUptime}\nLoad average: ${loadAvg}`,
      exitCode: 0,
    };
  }
}

// Browser-compatible system info command
class BrowserSysInfoCommand implements ICommand {
  readonly id = "sysinfo";
  readonly description = "Display browser system information";

  validate(args: string[]): boolean {
    return args.length === 0; // No arguments allowed
  }

  async execute(_args: string[]): Promise<CommandResult> {
    // Get browser info
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const languages = navigator.languages?.join(", ") || navigator.language;
    const memory = (navigator as any).deviceMemory
      ? `${(navigator as any).deviceMemory}GB`
      : "Unknown";
    const cores = navigator.hardwareConcurrency || "Unknown";

    // Generate simulated system info using browser data
    const info = [
      `Browser: ${this.getBrowserInfo(userAgent)}`,
      `Platform: ${platform}`,
      `Languages: ${languages}`,
      `Memory: ${memory}`,
      `CPU Cores: ${cores}`,
      `Screen Resolution: ${window.screen.width}x${window.screen.height}`,
      `Window Size: ${window.innerWidth}x${window.innerHeight}`,
    ].join("\n");

    return {
      output: info,
      exitCode: 0,
    };
  }

  // Helper to parse browser info from user agent
  private getBrowserInfo(userAgent: string): string {
    if (userAgent.includes("Firefox")) {
      return "Mozilla Firefox";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      return "Google Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edg")) {
      return "Microsoft Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      return "Opera";
    } else {
      return "Unknown Browser";
    }
  }
}

export class SystemInfoPlugin extends BasePlugin {
  readonly id = "system-info";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [
    new BrowserUptimeCommand(),
    new BrowserSysInfoCommand(),
  ];
}
