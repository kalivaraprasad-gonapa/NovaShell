import React from "react";
import { TerminalOutputEntry } from "../types/TerminalOutputEntry";
import { useTheme } from "../theme/ThemeContext";

interface TerminalOutputProps {
  entries: ReadonlyArray<TerminalOutputEntry>;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ entries }) => {
  const { theme } = useTheme();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: "0.25rem" }}>
          {entry.type === "command" && (
            <div style={{ display: "flex" }}>
              <span
                style={{ color: theme.primaryColor, marginRight: "0.5rem" }}
              >
                $
              </span>
              <span>{entry.content}</span>
            </div>
          )}

          {entry.type === "output" && (
            <div>
              {typeof entry.content === "string" ? (
                <div style={{ whiteSpace: "pre-wrap" }}>{entry.content}</div>
              ) : (
                entry.content
              )}
            </div>
          )}

          {entry.type === "error" && (
            <div style={{ color: "#ff5555", whiteSpace: "pre-wrap" }}>
              {entry.content}
            </div>
          )}

          {entry.type === "info" && (
            <div style={{ color: "#8888ff", whiteSpace: "pre-wrap" }}>
              {entry.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
