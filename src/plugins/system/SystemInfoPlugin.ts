import { ICommand, CommandResult } from "@/core/interfaces/ICommand";
import { BasePlugin } from "../base/BasePlugin";
import os from "os";

class UptimeCommand implements ICommand {
  readonly id = "uptime";
  readonly description = "Show how long the system has been running";

  validate(args: string[]): boolean {
    return args.length === 0; // No arguments allowed
  }

  async execute(_args: string[]): Promise<CommandResult> {
    const uptime = os.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);

    const formattedUptime = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;
    const loadAvg = os
      .loadavg()
      .map((load) => load.toFixed(2))
      .join(", ");

    return {
      output: `Uptime: ${formattedUptime}\nLoad average: ${loadAvg}`,
      exitCode: 0,
    };
  }
}

class SysInfoCommand implements ICommand {
  readonly id = "sysinfo";
  readonly description = "Display system information";

  validate(args: string[]): boolean {
    return args.length === 0; // No arguments allowed
  }

  async execute(_args: string[]): Promise<CommandResult> {
    const cpuInfo = os.cpus()[0];
    const totalMem =
      Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 10) / 10;
    const freeMem = Math.round((os.freemem() / (1024 * 1024 * 1024)) * 10) / 10;

    const info = [
      `OS: ${os.type()} ${os.release()} ${os.arch()}`,
      `Hostname: ${os.hostname()}`,
      `CPU: ${cpuInfo.model} (${os.cpus().length} cores)`,
      `Memory: ${freeMem}GB free of ${totalMem}GB total`,
      `Uptime: ${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
    ].join("\n");

    return {
      output: info,
      exitCode: 0,
    };
  }
}

export class SystemInfoPlugin extends BasePlugin {
  readonly id = "system-info";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [
    new UptimeCommand(),
    new SysInfoCommand(),
  ];
}
