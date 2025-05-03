import { ICommand, ICommandRegistry } from "../interfaces/ICommand";

export class CommandRegistry implements ICommandRegistry {
  private readonly commands = new Map<string, ICommand>();

  register(command: ICommand): void {
    if (this.commands.has(command.id)) {
      throw new Error(`Command with ID ${command.id} is already registered`);
    }
    this.commands.set(command.id, command);
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
