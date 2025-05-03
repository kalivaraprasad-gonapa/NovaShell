import React, { useRef, useEffect } from "react";
import { useTerminal } from "./TerminalContext";
import { useTheme } from "../theme/ThemeContext";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";

export const Terminal: React.FC = () => {
  const { outputEntries, isExecuting } = useTerminal();
  const { theme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputEntries]);

  const terminalStyle: React.CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "0.5rem",
    boxSizing: "border-box",
  };

  const outputContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "0.5rem",
  };

  return (
    <div style={terminalStyle}>
      <div ref={terminalRef} style={outputContainerStyle}>
        <TerminalOutput entries={outputEntries} />
      </div>
      <TerminalInput disabled={isExecuting} />
    </div>
  );
};
