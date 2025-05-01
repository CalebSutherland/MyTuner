import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useThemeUtils } from "../hooks/useThemeUtils";

interface Theme {
  color: string;
  fontColor: string;
  image: string;
}

interface ThemeContextType {
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
  selectedTheme: Theme;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme>>;
  savedColors: string[];
  setSavedColors: React.Dispatch<React.SetStateAction<string[]>>;
  savedFontColors: string[];
  setSavedFontColors: React.Dispatch<React.SetStateAction<string[]>>;
  applyTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { darkenColor, updateMainLight } = useThemeUtils();

  const [themes, setThemes] = useState<Theme[]>([
    { color: "#700b0b", fontColor: "#ffffff", image: "/assets/guitar_3.png" },
    { color: "#B302C0", fontColor: "#ffffff", image: "/assets/brown.png" },
    { color: "#00FFFF", fontColor: "#000000", image: "/assets/martin-guitar-decal-gold.png" },
    { color: "#FFFF00", fontColor: "#000000", image: "/assets/black-guitar2.png" },
  ]);
  
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [savedColors, setSavedColors] = useState<string[]>(['#700b0b', '#B302C0', '#00FFFF', '#FFFF00']);
  const [savedFontColors, setSavedFontColors] = useState<string[]>(['#FFFFFF', '#000000']);
  
  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.fontColor);
    updateMainLight(theme.color);
  };

  return (
    <ThemeContext.Provider value={{ themes, setThemes, selectedTheme, setSelectedTheme, savedColors, setSavedColors, savedFontColors, setSavedFontColors, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};