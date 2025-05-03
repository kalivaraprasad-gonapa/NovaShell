// config/plugins.ts - Modified with system shell integration
import { IShellSession } from "@/core/interfaces/ICommand";
import { PluginManager } from "../core/plugin/PluginManager";
import { FileSystemPlugin } from "../plugins/file-system/FileSystemPlugin";
import { SystemInfoPlugin } from "../plugins/system/SystemInfoPlugin";
import { NetworkToolsPlugin } from "../plugins/network/NetworkToolsPlugin";
import { GitPlugin } from "../plugins/development/GitPlugin";
import { SystemShellPlugin } from "../plugins/system-shell/SystemShellPlugin";

export async function registerDefaultPlugins(
  shellSession: IShellSession,
): Promise<PluginManager> {
  const pluginManager = new PluginManager(shellSession);

  // Register default plugins
  await pluginManager.registerPlugin(new FileSystemPlugin());
  await pluginManager.registerPlugin(new SystemInfoPlugin());
  await pluginManager.registerPlugin(new NetworkToolsPlugin());
  await pluginManager.registerPlugin(new GitPlugin());

  // Register the system shell plugin last so it acts as a fallback
  const systemShellPlugin = new SystemShellPlugin();
  await pluginManager.registerPlugin(systemShellPlugin);

  return pluginManager;
}
