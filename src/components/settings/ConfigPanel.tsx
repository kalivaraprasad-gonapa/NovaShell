// components/settings/ConfigPanel.tsx
import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { useConfig } from "../../hooks/useConfig";
import {
  ThemeConfig,
  ThemeConfigProvider,
} from "../../config/providers/ThemeConfigProvider";
import {
  TerminalConfig,
  TerminalConfigProvider,
} from "../../config/providers/TerminalConfigProvider";
import {
  KeyBindingConfig,
  KeyBindingsConfigProvider,
} from "../../config/providers/KeyBindingsConfigProvider";
import { IConfigManager } from "@/core/interfaces/ICommand";

interface ConfigPanelProps {
  configManager: IConfigManager;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  configManager,
  onClose,
}) => {
  const { theme } = useTheme();
  const themeProvider = configManager.getProvider<ThemeConfig>(
    "theme",
  ) as ThemeConfigProvider;
  const terminalProvider = configManager.getProvider<TerminalConfig>(
    "terminal",
  ) as TerminalConfigProvider;
  const keyBindingsProvider = configManager.getProvider<KeyBindingConfig>(
    "key-bindings",
  ) as KeyBindingsConfigProvider;

  const [themeConfig, updateThemeConfig] = useConfig(themeProvider);
  const [terminalConfig, updateTerminalConfig] = useConfig(terminalProvider);
  const [keyBindingsConfig, updateKeyBindingsConfig] =
    useConfig(keyBindingsProvider);

  // Only render when all configs are loaded
  if (!themeConfig || !terminalConfig || !keyBindingsConfig) {
    return <div>Loading settings...</div>;
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    themeProvider.setTheme(e.target.value as ThemeConfig["theme"]);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateThemeConfig({ fontSize: Number(e.target.value) });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateThemeConfig({ fontFamily: e.target.value });
  };

  const handlePromptSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTerminalConfig({ promptSymbol: e.target.value });
  };

  const handleHistorySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTerminalConfig({ historySize: Number(e.target.value) });
  };

  const handleLineNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTerminalConfig({ showLineNumbers: e.target.checked });
  };

  const handleTabCompletionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateTerminalConfig({ tabCompletionEnabled: e.target.checked });
  };

  const handleShellWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTerminalConfig({
      shellWidth: e.target.value as TerminalConfig["shellWidth"],
    });
  };

  const panelStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    padding: "1rem",
    borderRadius: "4px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    maxWidth: "500px",
    width: "100%",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const headingStyle: React.CSSProperties = {
    color: theme.primaryColor,
    marginBottom: "0.5rem",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: theme.darkMode ? "#333" : "#f0f0f0",
    color: theme.textColor,
    border: `1px solid ${theme.darkMode ? "#555" : "#ccc"}`,
    borderRadius: "3px",
    padding: "0.25rem 0.5rem",
    font: "inherit",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.primaryColor,
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    padding: "0.5rem 1rem",
    font: "inherit",
    cursor: "pointer",
    marginTop: "1rem",
  };

  return (
    <div style={panelStyle}>
      <h2 style={headingStyle}>Settings</h2>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Appearance</h3>

        <div style={fieldStyle}>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={themeConfig.theme}
            onChange={handleThemeChange}
            style={inputStyle}
          >
            <option value="default">Default</option>
            <option value="monokai">Monokai</option>
            <option value="solarized">Solarized</option>
            <option value="nord">Nord</option>
            <option value="dracula">Dracula</option>
            <option value="github">GitHub</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="fontSize">Font Size</label>
          <input
            id="fontSize"
            type="number"
            min="10"
            max="24"
            value={themeConfig.fontSize}
            onChange={handleFontSizeChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="fontFamily">Font Family</label>
          <select
            id="fontFamily"
            value={themeConfig.fontFamily}
            onChange={handleFontFamilyChange}
            style={inputStyle}
          >
            <option value='Menlo, Monaco, "Courier New", monospace'>
              Menlo/Monaco
            </option>
            <option value='"Fira Code", monospace'>Fira Code</option>
            <option value='"JetBrains Mono", monospace'>JetBrains Mono</option>
            <option value='"Source Code Pro", monospace'>
              Source Code Pro
            </option>
            <option value="monospace">System Monospace</option>
          </select>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Terminal</h3>

        <div style={fieldStyle}>
          <label htmlFor="promptSymbol">Prompt Symbol</label>
          <input
            id="promptSymbol"
            type="text"
            value={terminalConfig.promptSymbol}
            onChange={handlePromptSymbolChange}
            maxLength={3}
            style={{ ...inputStyle, width: "50px", textAlign: "center" }}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="historySize">History Size</label>
          <input
            id="historySize"
            type="number"
            min="100"
            max="10000"
            step="100"
            value={terminalConfig.historySize}
            onChange={handleHistorySizeChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="showLineNumbers">Show Line Numbers</label>
          <input
            id="showLineNumbers"
            type="checkbox"
            checked={terminalConfig.showLineNumbers}
            onChange={handleLineNumbersChange}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="tabCompletion">Tab Completion</label>
          <input
            id="tabCompletion"
            type="checkbox"
            checked={terminalConfig.tabCompletionEnabled}
            onChange={handleTabCompletionChange}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="shellWidth">Shell Width</label>
          <select
            id="shellWidth"
            value={terminalConfig.shellWidth}
            onChange={handleShellWidthChange}
            style={inputStyle}
          >
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
            <option value="full">Full Width</option>
          </select>
        </div>
      </div>

      <button style={buttonStyle} onClick={onClose}>
        Close Settings
      </button>
    </div>
  );
};
