import { createContext, useContext } from "react";

export interface ThemeOptions {
  readonly darkMode: boolean;
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly primaryColor: string;
  readonly backgroundColor: string;
  readonly textColor: string;
}

const defaultTheme: ThemeOptions = {
  darkMode: true,
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  primaryColor: "#00aaff",
  backgroundColor: "#1e1e1e",
  textColor: "#ffffff",
};

export interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: (theme: Partial<ThemeOptions>) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
