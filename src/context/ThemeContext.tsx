import { useState, createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ThemeContextType {
  theme: string;
  setThemeFromUserInput?: (newTheme: string) => void;
  themeValue?: string;
  setThemeValue?: (newTheme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { getItem, setItem } = useLocalStorage();
  const systemTheme: string = window.matchMedia("(prefers-color-scheme: light)")
    .matches
    ? "light"
    : "dark";

  const [themeValue, setThemeValue] = useState<string>(() => {
    const storedTheme = getItem("ps_theme");
    return storedTheme || "system";
  });

  const theme = themeValue === "system" ? systemTheme : themeValue;

  const setThemeFromUserInput = (newTheme: string) => {
    setThemeValue(newTheme);
    setItem("ps_theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeFromUserInput,
        themeValue,
        setThemeValue,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
