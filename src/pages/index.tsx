import React from "react";
import { Rnd } from "react-rnd";
import { ShellFactory } from "../core/factory/ShellFactory";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { TerminalProvider } from "../components/terminal/TerminalProvider";
import { Terminal } from "../components/terminal/Terminal";

export default function Home() {
  const shellSession = ShellFactory.createDefaultShell();

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Rnd
        default={{
          x: 100,
          y: 100,
          width: 600,
          height: 400,
        }}
        bounds="parent"
        minWidth={300}
        minHeight={200}
        style={{ border: "1px solid #ccc", backgroundColor: "#000" }}
      >
        <ThemeProvider>
          <TerminalProvider shellSession={shellSession}>
            <Terminal />
          </TerminalProvider>
        </ThemeProvider>
      </Rnd>
    </div>
  );
}
