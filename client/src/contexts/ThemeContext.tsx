import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from "./AuthContext";
import { useThemeUtils } from "../hooks/useThemeUtils";

interface Theme {
  color: string;
  fontColor: string;
  image: string;
}

interface ThemeContextType {
  themes: Theme[] | null;
  setThemes: React.Dispatch<React.SetStateAction<Theme[] | null>>;
  selectedTheme: Theme | null;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
  savedColors: string[] | null;
  setSavedColors: React.Dispatch<React.SetStateAction<string[] | null>>;
  savedFontColors: string[] | null;
  setSavedFontColors: React.Dispatch<React.SetStateAction<string[] | null>>;
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
  
  const [themes, setThemes] = useState<Theme[] | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [savedColors, setSavedColors] = useState<string[] | null>(null);
  const [savedFontColors, setSavedFontColors] = useState<string[] | null>(null);
  const [isThemeLoading, setIsThemeLoading] = useState(true);
  
  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.fontColor);
    updateMainLight(theme.color);
    document.documentElement.setAttribute("data-theme-loaded", "true");
  };

  const resetToDefaultThemes = () => {
    setThemes(defaultThemes);
    setSelectedTheme(defaultThemes[0]);
    setSavedColors(defaultThemes.map(t => t.color));
    setSavedFontColors(["#FFFFFF", "#000000"]);
    applyTheme(defaultThemes[0]);
  };

  useEffect(() => {
    if (user === undefined) return;

    document.documentElement.removeAttribute("data-theme-loaded");
    
    const fetchThemes = async () => {
      if (!user) {
        setIsThemeLoading(false);
        resetToDefaultThemes();
        return;
      }
  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/themes/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setThemes(data.themes || []);
          applyTheme(data.selectedTheme);
        } else {
          resetToDefaultThemes();
        }
      } catch (error) {
        console.error("Error loading user themes:", error);
        resetToDefaultThemes();
      } finally {
        setIsThemeLoading(false);
      }
    };
  
    fetchThemes();
  }, [user]);

  if (isThemeLoading) {
    return null;
  }

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