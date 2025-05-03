import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from "./AuthContext";
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
  resetToDefaultThemes: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const defaultThemes: Theme[] = [
  { color: "#700b0b", fontColor: "#ffffff", image: "/assets/guitar_3.png" },
  { color: "#B302C0", fontColor: "#ffffff", image: "/assets/brown.png" },
  { color: "#00FFFF", fontColor: "#000000", image: "/assets/martin-guitar-decal-gold.png" },
  { color: "#FFFF00", fontColor: "#000000", image: "/assets/black-guitar2.png" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { darkenColor, updateMainLight } = useThemeUtils();
  const { user } = useAuth();

  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultThemes[0]);
  const [savedColors, setSavedColors] = useState<string[]>(defaultThemes.map(t => t.color));
  const [savedFontColors, setSavedFontColors] = useState<string[]>(["#FFFFFF", "#000000"]);
  
  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.fontColor);
    updateMainLight(theme.color);
  };

  const resetToDefaultThemes = () => {
    setThemes(defaultThemes);
    setSelectedTheme(defaultThemes[0]);
    setSavedColors(defaultThemes.map(t => t.color));
    setSavedFontColors(["#FFFFFF", "#000000"]);
    applyTheme(defaultThemes[0]);
  };

  useEffect(() => {
    const fetchThemes = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/themes/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setThemes(data.themes || []);
          applyTheme(data.selectedTheme);
        }
      } catch (error) {
        console.error("Error loading user themes:", error);
      }
    };

    fetchThemes();
  }, [user]);

  return (
    <ThemeContext.Provider value={{
      themes,
      setThemes,
      selectedTheme,
      setSelectedTheme,
      savedColors,
      setSavedColors,
      savedFontColors,
      setSavedFontColors,
      applyTheme,
      resetToDefaultThemes,
    }}>
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