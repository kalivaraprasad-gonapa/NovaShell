import { IConfigManager } from "../core/interfaces/ICommand";
import { ConfigManager } from "../core/config/ConfigManager";
import { TerminalConfigProvider } from "./providers/TerminalConfigProvider";
import { ThemeConfigProvider } from "./providers/ThemeConfigProvider";
import { KeyBindingsConfigProvider } from "./providers/KeyBindingsConfigProvider";

export function createConfigManager(): IConfigManager {
  const configManager = new ConfigManager();

  // Register default providers
  configManager.registerProvider(new TerminalConfigProvider());
  configManager.registerProvider(new ThemeConfigProvider());
  configManager.registerProvider(new KeyBindingsConfigProvider());

  return configManager;
}
