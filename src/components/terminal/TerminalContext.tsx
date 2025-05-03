import { createContext, useContext } from "react";
import { TerminalOutputEntry } from "../types/TerminalOutputEntry";
import { CommandResult, IShellSession } from "@/core/interfaces/ICommand";

export interface TerminalContextType {
  readonly shellSession: IShellSession;
  readonly outputEntries: ReadonlyArray<TerminalOutputEntry>;
  readonly isExecuting: boolean;
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
