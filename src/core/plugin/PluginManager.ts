import { ICommandPlugin, IShellSession } from "../interfaces/ICommand";

export class PluginManager {
  private readonly plugins = new Map<string, ICommandPlugin>();
  private readonly shellSession: IShellSession;

  constructor(shellSession: IShellSession) {
    this.shellSession = shellSession;
  }

  async registerPlugin(plugin: ICommandPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID ${plugin.id} is already registered`);
    }

    await plugin.initialize(this.shellSession);

    // Register all commands from the plugin
    const registry = this.shellSession.getCommandRegistry();
    for (const command of plugin.commands) {
      registry.register(command);
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
