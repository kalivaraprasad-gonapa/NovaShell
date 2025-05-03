import { LocalStorageConfigProvider } from "../../core/config/LocalStorageConfigProvider";

export interface ThemeConfig {
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  selectionColor: string;
  theme: "default" | "monokai" | "solarized" | "nord" | "dracula" | "github";
}

export class ThemeConfigProvider extends LocalStorageConfigProvider<ThemeConfig> {
  readonly id = "theme";
  readonly description = "Theme and appearance settings";
  readonly defaultConfig: ThemeConfig = {
    darkMode: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    primaryColor: "#00aaff",
    backgroundColor: "#1e1e1e",
    textColor: "#ffffff",
    accentColor: "#ff5555",
    selectionColor: "rgba(255, 255, 255, 0.3)",
    theme: "default",
  };

  async setTheme(themeName: ThemeConfig["theme"]): Promise<void> {
    const themeConfigs: Record<ThemeConfig["theme"], Partial<ThemeConfig>> = {
      default: {
        darkMode: true,
        backgroundColor: "#1e1e1e",
        textColor: "#ffffff",
        primaryColor: "#00aaff",
        accentColor: "#ff5555",
      },
      monokai: {
        darkMode: true,
        backgroundColor: "#272822",
        textColor: "#f8f8f2",
        primaryColor: "#a6e22e",
        accentColor: "#f92672",
      },
      solarized: {
        darkMode: true,
        backgroundColor: "#002b36",
        textColor: "#839496",
        primaryColor: "#b58900",
        accentColor: "#cb4b16",
      },
      nord: {
        darkMode: true,
        backgroundColor: "#2e3440",
        textColor: "#d8dee9",
        primaryColor: "#88c0d0",
        accentColor: "#bf616a",
      },
      dracula: {
        darkMode: true,
        backgroundColor: "#282a36",
        textColor: "#f8f8f2",
        primaryColor: "#bd93f9",
        accentColor: "#ff79c6",
      },
      github: {
        darkMode: false,
        backgroundColor: "#ffffff",
        textColor: "#24292e",
        primaryColor: "#0366d6",
        accentColor: "#d73a49",
      },
    };

    const themeConfig = themeConfigs[themeName] || themeConfigs.default;

    await this.setConfig({
      ...themeConfig,
      theme: themeName,
    });
  }
}
