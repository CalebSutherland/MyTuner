import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from "./AuthContext";
import { useThemeUtils } from "../hooks/useThemeUtils";

interface Theme {
  color: string;
  font_color: string;
  image: string;
}

interface ThemeContextType {
  themes: Theme[] | null;
  setThemes: React.Dispatch<React.SetStateAction<Theme[] | null>>;
  selectedTheme: Theme | null;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
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
  { color: "#700b0b", font_color: "#ffffff", image: "/assets/guitar_3.png" },
  { color: "#B302C0", font_color: "#ffffff", image: "/assets/brown.png" },
  { color: "#00FFFF", font_color: "#000000", image: "/assets/martin-guitar-decal-gold.png" },
  { color: "#FFFF00", font_color: "#000000", image: "/assets/black-guitar2.png" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { darkenColor, updateMainLight } = useThemeUtils();
  const { user } = useAuth();
  
  const [themes, setThemes] = useState<Theme[] | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [savedFontColors, setSavedFontColors] = useState<string[]>([]);
  const [isThemeLoading, setIsThemeLoading] = useState(true);
  
  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.font_color);
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
    
    const fetchUserData = async () => {
      if (!user) {
        setIsThemeLoading(false);
        resetToDefaultThemes();
        return;
      }
  
      try {
        const themeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/themes/${user.username}`);
        const colorResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.username}/colors`);

        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemes(themeData.themes || []);
          applyTheme(themeData.selectedTheme);
        } else {
          resetToDefaultThemes();
        }
  
        if (colorResponse.ok) {
          const colorData = await colorResponse.json();
          setSavedColors(colorData.main_colors || []);
          setSavedFontColors(colorData.font_colors || []);
        }
      } catch (error) {
        console.error("Error loading user themes or colors:", error);
        resetToDefaultThemes();
      } finally {
        setIsThemeLoading(false);
      }
    };
  
    fetchUserData();
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