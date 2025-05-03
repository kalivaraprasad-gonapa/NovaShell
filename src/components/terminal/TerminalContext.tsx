// src/components/terminal/TerminalContext.tsx
import { createContext, useContext } from "react";
import { TerminalOutputEntry } from "../types/TerminalOutputEntry";
import { CommandResult, IShellSession } from "@/core/interfaces/ICommand";
import { ITabCompletionRegistry } from "@/core/interfaces/ITabCompletion";

export interface TerminalContextType {
  readonly shellSession: IShellSession;
  readonly outputEntries: ReadonlyArray<TerminalOutputEntry>;
  readonly isExecuting: boolean;
  readonly tabCompletionRegistry: ITabCompletionRegistry;
  executeCommand: (command: string) => Promise<CommandResult>;
  clearOutput: () => void;
}

export const TerminalContext = createContext<TerminalContextType | null>(null);

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
};
