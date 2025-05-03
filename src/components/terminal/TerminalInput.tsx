// src/components/terminal/TerminalInput.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useTerminal } from "./TerminalContext";
import { useTheme } from "../theme/ThemeContext";
import { CompletionMatch } from "@/core/interfaces/ITabCompletion";

interface TerminalInputProps {
  disabled?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [completions, setCompletions] = useState<CompletionMatch[]>([]);
  const [completionIndex, setCompletionIndex] = useState(-1);
  const [showCompletions, setShowCompletions] = useState(false);

  const { executeCommand, shellSession, tabCompletionRegistry } = useTerminal();
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
    // Reset completions when input changes
    setCompletions([]);
    setCompletionIndex(-1);
    setShowCompletions(false);
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
      setCompletions([]);
      setCompletionIndex(-1);
      setShowCompletions(false);
    } catch (error) {
      console.error("Error executing command:", error);
    }
  };

  const getCompletions = async () => {
    if (!tabCompletionRegistry || !inputRef.current) {
      return;
    }

    const cursorPosition = inputRef.current.selectionStart || inputValue.length;
    const matches = await tabCompletionRegistry.getCompletions(
      inputValue,
      cursorPosition,
    );

    setCompletions(matches);
    setCompletionIndex(matches.length > 0 ? 0 : -1);
    setShowCompletions(matches.length > 0);
  };

  const applyCompletion = (completion: CompletionMatch) => {
    setInputValue(completion.value);
    setCompletions([]);
    setCompletionIndex(-1);
    setShowCompletions(false);

    // Focus the input after applying completion
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const history = shellSession.getHistory().getAll();

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (showCompletions) {
        // Navigate completions
        setCompletionIndex((prev) =>
          prev > 0 ? prev - 1 : completions.length - 1,
        );
      } else {
        // Navigate history
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInputValue(history[history.length - 1 - newIndex]);
        }
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (showCompletions) {
        // Navigate completions
        setCompletionIndex((prev) =>
          prev < completions.length - 1 ? prev + 1 : 0,
        );
      } else {
        // Navigate history
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInputValue(history[history.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInputValue("");
        }
      }
    } else if (event.key === "Tab") {
      event.preventDefault();

      if (showCompletions && completionIndex >= 0) {
        // Apply the selected completion
        applyCompletion(completions[completionIndex]);
      } else {
        // Get new completions
        getCompletions();
      }
    } else if (event.key === "Escape") {
      // Hide completions
      setCompletions([]);
      setCompletionIndex(-1);
      setShowCompletions(false);
    } else if (
      event.key === "Enter" &&
      showCompletions &&
      completionIndex >= 0
    ) {
      // Apply the selected completion
      event.preventDefault();
      applyCompletion(completions[completionIndex]);
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

  const completionsStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: theme.backgroundColor,
    border: `1px solid ${theme.primaryColor}`,
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 10,
  };

  const completionItemStyle = (index: number): React.CSSProperties => ({
    padding: "0.25rem 0.5rem",
    cursor: "pointer",
    backgroundColor:
      index === completionIndex ? theme.primaryColor : "transparent",
    color: index === completionIndex ? theme.backgroundColor : theme.textColor,
  });

  return (
    <div style={{ position: "relative" }}>
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

      {showCompletions && (
        <div style={completionsStyle}>
          {completions.map((completion, index) => (
            <div
              key={completion.value}
              style={completionItemStyle(index)}
              onClick={() => applyCompletion(completion)}
            >
              <span>{completion.value}</span>
              {completion.description && (
                <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                  - {completion.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
