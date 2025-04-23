import React, { useState, useEffect } from "react";
import ThemeCustomizer from "../ThemeCustomizer/ThemeCustomizer";
import './ThemeSelector.css';

type Theme = {
  color: string;
  fontColor: string;
};

type ThemeSelectorProps = {
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
  selectedTheme: Theme;
  applyTheme: (theme: Theme) => void;
  savedColors: string[];
  setSavedColors: React.Dispatch<React.SetStateAction<string[]>>;
  savedFontColors: string[];
  setSavedFontColors: React.Dispatch<React.SetStateAction<string[]>>;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes, 
  setThemes, 
  selectedTheme, 
  applyTheme,
  savedColors,
  setSavedColors,
  savedFontColors,
  setSavedFontColors,
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [newTheme, setNewTheme] = useState<Theme>({
    color: "#0B8948",
    fontColor: "#ffffff",
  });
  const [activeTab, setActiveTab] = useState<'color' | 'fontColor' | 'image'>('color');

  const handleSaveTheme = () => {
    const themeToAdd = {
      color: newTheme.color,
      fontColor: newTheme.fontColor,
    };
  
    setThemes([...themes, themeToAdd]);
    setShowCustomizer(false);
    applyTheme(themeToAdd);
    setNewTheme({ color: "#0B8948", fontColor: "#ffffff" });
  };

  useEffect(() => {
    setNewTheme(selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="theme-selector">
      <div className="theme-list">
        {themes.map((theme, idx) => (
          <button
            key={idx}
            className="theme-preview"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.color} 70%, ${theme.fontColor} 70%)`,
              border: `2px solid ${theme.color}`,
              color: 'transparent',
            }}
            onClick={() => applyTheme(theme)}
          />
        ))}
        <button 
          className="add-theme-btn" 
          onClick={() => {
            if (showCustomizer) {
              setActiveTab('color');
            }
            setShowCustomizer(prev => !prev)
          }}
        >
          {showCustomizer ? '×' : '+'}
        </button>
      </div>
  
      {showCustomizer && (
        <ThemeCustomizer 
          newTheme={newTheme}
          setNewTheme={setNewTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleSaveTheme={handleSaveTheme}
          savedColors={savedColors}
          setSavedColors={setSavedColors}
          savedFontColors={savedFontColors}
          setSavedFontColors={setSavedFontColors}
        />
      )}
    </div>
  );
};

export default ThemeSelector;