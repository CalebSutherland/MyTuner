import React, { useState, useEffect } from "react";
import ThemeCustomizer from "../ThemeCustomizer/ThemeCustomizer";
import { FaEdit, FaCheck } from "react-icons/fa";
import './ThemeSelector.css';

type Theme = {
  color: string;
  fontColor: string;
  image: string;
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
    image: "assets/guitar_3.png",
  });
  const [activeTab, setActiveTab] = useState<'color' | 'fontColor' | 'image'>('color');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveTheme = () => {
    const themeToAdd = {
      color: newTheme.color,
      fontColor: newTheme.fontColor,
      image: newTheme.image,
    };
  
    setThemes([...themes, themeToAdd]);
    setShowCustomizer(false);
    applyTheme(themeToAdd);
    setNewTheme({ color: "#0B8948", fontColor: "#ffffff", image: "assets/guitar_3.png" });
  };

  const handleDeleteTheme = (index: number) => {
    setThemes((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setNewTheme(selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="theme-selector">
      <div className="theme-list">
        {themes.map((theme, idx) => (
          <div key={idx} className="theme-box-wrapper">
            <button
              className="theme-preview"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.color} 70%, ${theme.fontColor} 70%)`,
                border: `2px solid ${theme.color}`,
                color: 'transparent',
              }}
              onClick={() => !isEditing && applyTheme(theme)}
            />
            {isEditing && (
              <button
                className="delete-theme-btn"
                onClick={() => handleDeleteTheme(idx)}
              >
                ×
              </button>
            )}
          </div>
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
        <button className="edit-theme-btn" onClick={() => setIsEditing(prev => !prev)}>
          {isEditing ? <FaCheck /> : <FaEdit />}
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