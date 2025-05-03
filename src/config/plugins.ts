// config/plugins.ts
import { IShellSession } from "@/core/interfaces/ICommand";
import { PluginManager } from "../core/plugin/PluginManager";
import { FileSystemPlugin } from "../plugins/file-system/FileSystemPlugin";
import { SystemInfoPlugin } from "../plugins/system/SystemInfoPlugin";
import { NetworkToolsPlugin } from "../plugins/network/NetworkToolsPlugin";
import { GitPlugin } from "../plugins/development/GitPlugin";
import { SystemShellPlugin } from "../plugins/system-shell/SystemShellPlugin";
import { EnvCommand } from "@/plugins/system/EnvCommand";
import { EchoExpandCommand } from "@/plugins/system/EchoExpandCommand";

export async function registerDefaultPlugins(
  shellSession: IShellSession,
): Promise<PluginManager> {
  const pluginManager = new PluginManager(shellSession);

  // Register commands that aren't part of a specific plugin
  const registry = shellSession.getCommandRegistry();

  try {
    // These commands might already be registered in ShellFactory, so wrap in try/catch
    registry.register(new EnvCommand(shellSession.getEnvironmentManager()));
    registry.register(
      new EchoExpandCommand(shellSession.getEnvironmentManager()),
    );
  } catch (error) {
    console.warn("Some commands were already registered:", error);
  }

  // Register default plugins in a specific order
  await pluginManager.registerPlugin(
    new FileSystemPlugin(shellSession.getWorkingDirectoryManager()),
  );
  await pluginManager.registerPlugin(new SystemInfoPlugin());
  await pluginManager.registerPlugin(new NetworkToolsPlugin());
  await pluginManager.registerPlugin(new GitPlugin());

  // Register the system shell plugin last so it acts as a fallback
  const systemShellPlugin = new SystemShellPlugin();
  await pluginManager.registerPlugin(systemShellPlugin);

  return pluginManager;
}
