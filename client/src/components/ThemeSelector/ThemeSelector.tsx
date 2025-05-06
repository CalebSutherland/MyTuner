import React, { useState, useEffect } from "react";
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeCustomizer from "../ThemeCustomizer/ThemeCustomizer";
import { FaEdit, FaCheck } from "react-icons/fa";
import './ThemeSelector.css';

const apiUrl = import.meta.env.VITE_API_URL;

type Theme = {
  color: string;
  font_color: string;
  image: string;
};

const ThemeSelector: React.FC = () => {
  const { themes, setThemes, selectedTheme, applyTheme } = useTheme();
  const { isLoggedIn, user } = useAuth();

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [newTheme, setNewTheme] = useState<Theme>({
    color: "#0B8948",
    font_color: "#ffffff",
    image: "assets/guitar_3.png",
  });
  const [activeTab, setActiveTab] = useState<'color' | 'font_color' | 'image'>('color');
  const [isEditing, setIsEditing] = useState(false);

  const handleApplyTheme = async (theme: Theme) => {
    applyTheme(theme);
  
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
      font_color: newTheme.font_color,
      image: newTheme.image,
    };
  
    setThemes([...(themes ?? []), themeToAdd]);
    setShowCustomizer(false);
    setNewTheme({ color: "#0B8948", font_color: "#ffffff", image: "assets/guitar_3.png" });

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
    handleApplyTheme(themeToAdd);
  };

  const handleDeleteTheme = async (index: number) => {
    if (!themes || themes.length <= 1) {
      console.error("Cannot delete the last theme.");
      return;
    }
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
                backgroundImage: `linear-gradient(135deg, ${theme.color} 70%, ${theme.font_color} 70%)`,
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
        />
      )}
    </div>
  );
};

export default ThemeSelector;