// src/pages/index.tsx
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { ShellFactory } from "../core/factory/ShellFactory";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { TerminalProvider } from "../components/terminal/TerminalProvider";
import { Terminal } from "../components/terminal/Terminal";
import { IShellSession, IConfigProvider } from "@/core/interfaces/ICommand";
import { createConfigManager } from "@/config/ConfigBootstrap";
import { registerDefaultPlugins } from "@/config/plugins";
import {
  TerminalConfig,
  TerminalConfigProvider,
} from "@/config/providers/TerminalConfigProvider";

export default function Home() {
  const [shellSession, setShellSession] = useState<IShellSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTerminal = async () => {
      try {
        // Initialize config manager
        const configManager = createConfigManager();

        // Get terminal config provider - fix the type
        const terminalConfigProvider =
          configManager.getProvider<TerminalConfig>("terminal");

        if (!terminalConfigProvider) {
          throw new Error("Terminal configuration provider not found");
        }

        // Create shell with config
        const shell = await ShellFactory.createDefaultShell(
          terminalConfigProvider,
        );

        // Register plugins
        await registerDefaultPlugins(shell);

        setShellSession(shell);
      } catch (err) {
        console.error("Failed to initialize terminal:", err);
        setError(
          `Error initializing terminal: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    };

    initializeTerminal();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "monospace",
        }}
      >
        Loading NovaShell terminal...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "red",
          fontFamily: "monospace",
        }}
      >
        {error}
      </div>
    );
  }

  if (!shellSession) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "red",
          fontFamily: "monospace",
        }}
      >
        Failed to initialize shell session
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Rnd
        default={{
          x: 100,
          y: 100,
          width: 700,
          height: 500,
        }}
        bounds="parent"
        minWidth={300}
        minHeight={200}
        style={{
          border: "1px solid #333",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              backgroundColor: "#333",
              padding: "4px 8px",
              display: "flex",
              justifyContent: "space-between",
              color: "#fff",
              fontSize: "12px",
            }}
          >
            <span>NovaShell Terminal</span>
            <span>v1.0.0</span>
          </div>
          <div style={{ flex: 1 }}>
            <ThemeProvider>
              <TerminalProvider shellSession={shellSession}>
                <Terminal />
              </TerminalProvider>
            </ThemeProvider>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
