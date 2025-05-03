import React, { useState, useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import { TerminalContext, TerminalContextType } from "./TerminalContext";
import { TerminalOutputEntry } from "../types/TerminalOutputEntry";
import { CommandResult, IShellSession } from "@/core/interfaces/ICommand";

interface TerminalProviderProps {
  shellSession: IShellSession;
  children: React.ReactNode;
}

export const TerminalProvider: React.FC<TerminalProviderProps> = ({
  shellSession,
  children,
}) => {
  const [outputEntries, setOutputEntries] = useState<TerminalOutputEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = useCallback(
    async (command: string): Promise<CommandResult> => {
      // Add command to the terminal output
      const commandEntry: TerminalOutputEntry = {
        id: nanoid(),
        content: command,
        timestamp: new Date(),
        type: "command",
      };

      setOutputEntries((entries) => [...entries, commandEntry]);
      setIsExecuting(true);

      try {
        const result = await shellSession.executeCommand(command);

        // Add command result to the terminal output
        const resultEntry: TerminalOutputEntry = {
          id: nanoid(),
          content: result.output,
          timestamp: new Date(),
          type: result.exitCode === 0 ? "output" : "error",
        };

        setOutputEntries((entries) => [...entries, resultEntry]);
        return result;
      } catch (error) {
        // Add error to the terminal output
        const errorEntry: TerminalOutputEntry = {
          id: nanoid(),
          content: String(error),
          timestamp: new Date(),
          type: "error",
        };

        setOutputEntries((entries) => [...entries, errorEntry]);
        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    [shellSession],
  );

  const clearOutput = useCallback(() => {
    setOutputEntries([]);
  }, []);

  const value: TerminalContextType = {
    shellSession,
    outputEntries,
    isExecuting,
    executeCommand,
    clearOutput,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
};
