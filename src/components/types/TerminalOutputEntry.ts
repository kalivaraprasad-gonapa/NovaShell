import React from "react";

export interface TerminalOutputEntry {
  readonly id: string;
  readonly content: string | React.ReactNode;
  readonly timestamp: Date;
  readonly type: "command" | "output" | "error" | "info";
}
