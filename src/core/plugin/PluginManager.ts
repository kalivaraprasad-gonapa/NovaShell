// src/core/plugin/PluginManager.ts
import { ICommandPlugin, IShellSession, ICommand } from "../interfaces/ICommand";

export class PluginManager {
  private readonly plugins = new Map<string, ICommandPlugin>();
  private readonly shellSession: IShellSession;
  private readonly registeredCommandIds = new Set<string>();

  constructor(shellSession: IShellSession) {
    this.shellSession = shellSession;
    
    // Initialize with commands that are already registered
    const existingCommands = this.shellSession.getCommandRegistry().getAllCommands();
    existingCommands.forEach(cmd => this.registeredCommandIds.add(cmd.id));
  }

  async registerPlugin(plugin: ICommandPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID ${plugin.id} is already registered`);
    }

    await plugin.initialize(this.shellSession);

    // Register all commands from the plugin - but skip those that are already registered
    const registry = this.shellSession.getCommandRegistry();
    
    for (const command of plugin.commands) {
      try {
        // Try to register with silent option, so it will return false instead of throwing
        const registered = registry.register(command, { silent: true });
        if (registered) {
          this.registeredCommandIds.add(command.id);
        } else {
          console.warn(`Command with ID "${command.id}" from plugin "${plugin.id}" was not registered because a command with the same ID already exists.`);
        }
      } catch (error) {
        console.warn(`Error registering command "${command.id}" from plugin "${plugin.id}":`, error);
      }
    }

    this.plugins.set(plugin.id, plugin);
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    // Unregister all commands from the plugin
    const registry = this.shellSession.getCommandRegistry();
    for (const command of plugin.commands) {
      registry.unregister(command.id);
      this.registeredCommandIds.delete(command.id);
    }

    await plugin.terminate();
    this.plugins.delete(pluginId);
  }

  getPlugin(pluginId: string): ICommandPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): ReadonlyArray<ICommandPlugin> {
    return Array.from(this.plugins.values());
  }
}