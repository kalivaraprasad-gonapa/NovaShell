// components/terminal/TerminalInput.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useTerminal } from "./TerminalContext";
import { useTheme } from "../theme/ThemeContext";

interface TerminalInputProps {
  disabled?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { executeCommand, shellSession } = useTerminal();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and when disabled changes
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim() || disabled) {
      return;
    }

    try {
      await executeCommand(inputValue);
      setInputValue("");
      setHistoryIndex(-1);
    } catch (error) {
      console.error("Error executing command:", error);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const history = shellSession.getHistory().getAll();

    if (event.key === "ArrowUp") {
      event.preventDefault();

      // Navigate up through history
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      // Navigate down through history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    } else if (event.key === "Tab") {
      // TODO: Implement tab completion
      event.preventDefault();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "transparent",
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    border: "none",
    outline: "none",
    padding: "0.25rem 0",
    caretColor: theme.primaryColor,
  };

  const promptStyle: React.CSSProperties = {
    color: theme.primaryColor,
    marginRight: "0.5rem",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center" }}
    >
      <span style={promptStyle}>$</span>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        style={inputStyle}
      />
    </form>
  );
};
