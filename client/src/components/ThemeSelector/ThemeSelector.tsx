import React, { useState, useEffect } from "react";
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeCustomizer from "../ThemeCustomizer/ThemeCustomizer";
import { FaEdit, FaCheck } from "react-icons/fa";
import './ThemeSelector.css';

const apiUrl = import.meta.env.VITE_API_URL;

type Theme = {
  color: string;
  fontColor: string;
  image: string;
};

type ThemeSelectorProps = {
  savedColors: string[];
  setSavedColors: React.Dispatch<React.SetStateAction<string[]>>;
  savedFontColors: string[];
  setSavedFontColors: React.Dispatch<React.SetStateAction<string[]>>;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  savedColors,
  setSavedColors,
  savedFontColors,
  setSavedFontColors,
}) => {
  const { themes, setThemes, selectedTheme, applyTheme, resetToDefaultThemes } = useTheme();
  const { isLoggedIn, user } = useAuth();

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [newTheme, setNewTheme] = useState<Theme>({
    color: "#0B8948",
    fontColor: "#ffffff",
    image: "assets/guitar_3.png",
  });
  const [activeTab, setActiveTab] = useState<'color' | 'fontColor' | 'image'>('color');
  const [isEditing, setIsEditing] = useState(false);

  const handleApplyTheme = async (theme: Theme) => {
    applyTheme(theme); // visually apply theme
  
    if (isLoggedIn && user) {
      try {
        const response = await fetch(`${apiUrl}/api/users/${user.username}/selected-theme`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(theme),
        });
  
        if (!response.ok) {
          const data = await response.json();
          console.error("Error saving selected theme:", data.message);
        }
      } catch (error) {
        console.error("Error saving selected theme:", error);
      }
    }
  };

  const handleSaveTheme = async () => {
    const themeToAdd = {
      color: newTheme.color,
      fontColor: newTheme.fontColor,
      image: newTheme.image,
    };
  
    setThemes([...(themes ?? []), themeToAdd]);
    setShowCustomizer(false);
    handleApplyTheme(themeToAdd);
    setNewTheme({ color: "#0B8948", fontColor: "#ffffff", image: "assets/guitar_3.png" });

    if (isLoggedIn && user) {
      try {
        const response = await fetch(`${apiUrl}/api/users/${user.username}/themes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(themeToAdd),
        });
        
        if (response.ok) {
          console.log("Theme saved successfully.");
        } else {
          const data = await response.json();
          console.error("Error saving theme:", data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteTheme = async (index: number) => {
    if (!themes) return;
    const themeToDelete = themes[index];

    setThemes((prev) => {
      if (!prev) return [];
      return prev.filter((_, i) => i !== index);
    });

    if (isLoggedIn && user) {
      try {
        const response = await fetch(`${apiUrl}/api/users/${user.username}/themes`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(themeToDelete),
        });

        if (response.ok) {
          console.log("Theme deleted successfully.");
        } else {
          const data = await response.json();
          console.error("Error deleting theme:", data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (selectedTheme) {
      setNewTheme(selectedTheme);
    }
  }, [selectedTheme]);

  return (
    <div className="theme-selector">
      <div className="theme-list">
        {themes?.map((theme, idx) => (
          <div key={idx} className="theme-box-wrapper">
            <button
              className="theme-preview"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.color} 70%, ${theme.fontColor} 70%)`,
                border: `2px solid ${theme.color}`,
                color: 'transparent',
              }}
              onClick={() => !isEditing && handleApplyTheme(theme)}
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