import React, { useState, useCallback } from "react";
import { ThemeContext, ThemeOptions } from "./ThemeContext";

const defaultTheme: ThemeOptions = {
  darkMode: true,
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  primaryColor: "#00aaff",
  backgroundColor: "#1e1e1e",
  textColor: "#ffffff",
};

interface ThemeProviderProps {
  initialTheme?: Partial<ThemeOptions>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme,
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeOptions>({
    ...defaultTheme,
    ...initialTheme,
  });

  const setTheme = useCallback((newTheme: Partial<ThemeOptions>) => {
    setThemeState((prevTheme) => ({
      ...prevTheme,
      ...newTheme,
    }));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
