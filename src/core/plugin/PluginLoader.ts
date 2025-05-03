import { PluginManager } from "./PluginManager";
import fs from "fs/promises";
import path from "path";
import { ICommandPlugin, IShellSession } from "../interfaces/ICommand";

export class PluginLoader {
  private readonly pluginManager: PluginManager;

  constructor(shellSession: IShellSession) {
    this.pluginManager = new PluginManager(shellSession);
  }

  async loadFromDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await fs.readdir(directoryPath);

      for (const file of files) {
        if (file.endsWith(".js") || file.endsWith(".ts")) {
          const fullPath = path.join(directoryPath, file);
          await this.loadPluginFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error loading plugins from directory: ${error}`);
    }
  }

  private async loadPluginFile(filePath: string): Promise<void> {
    try {
      // Dynamic import
      const module = await import(filePath);

      // Find plugin class in the module
      const PluginClass = Object.values(module).find(
        (exportedItem): exportedItem is new () => ICommandPlugin => {
          return (
            typeof exportedItem === "function" &&
            "prototype" in exportedItem &&
            "id" in exportedItem.prototype &&
            "version" in exportedItem.prototype &&
            "commands" in exportedItem.prototype
          );
        },
      );

      if (PluginClass) {
        const plugin = new PluginClass();
        await this.pluginManager.registerPlugin(plugin);
        console.log(`Loaded plugin: ${plugin.id} v${plugin.version}`);
      }
    } catch (error) {
      console.error(`Error loading plugin from file ${filePath}: ${error}`);
    }
  }

  getPluginManager(): PluginManager {
    return this.pluginManager;
  }
}
