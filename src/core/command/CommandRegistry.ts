// src/core/command/CommandRegistry.ts
import { ICommand, ICommandRegistry } from "../interfaces/ICommand";

export interface RegisterOptions {
  overwrite?: boolean;
  silent?: boolean;
}

export class CommandRegistry implements ICommandRegistry {
  private readonly commands = new Map<string, ICommand>();

  register(command: ICommand, options?: RegisterOptions): boolean {
    const { overwrite = false, silent = false } = options || {};

    if (this.commands.has(command.id) && !overwrite) {
      if (!silent) {
        throw new Error(`Command with ID ${command.id} is already registered`);
      }
      return false;
    }

    this.commands.set(command.id, command);
    return true;
  }

  unregister(commandId: string): void {
    this.commands.delete(commandId);
  }

  getCommand(commandId: string): ICommand | undefined {
    return this.commands.get(commandId);
  }

  getAllCommands(): ReadonlyArray<ICommand> {
    return Array.from(this.commands.values());
  }
}
