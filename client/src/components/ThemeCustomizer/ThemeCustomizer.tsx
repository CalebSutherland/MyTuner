import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { FaEdit, FaCheck } from "react-icons/fa";
import './ThemeCustomizer.css'

type Theme = {
  color: string;
  font_color: string;
  image: string;
};

type ThemeCustomizerProps = {
  newTheme: Theme;
  setNewTheme: (theme: Theme) => void;
  activeTab: 'color' | 'font_color' | 'image';
  setActiveTab: (tab: 'color' | 'font_color' | 'image') => void;
  handleSaveTheme: () => void;
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  newTheme,
  setNewTheme,
  activeTab,
  setActiveTab,
  handleSaveTheme
}) => {
  const { user } = useAuth();
  const { savedColors, setSavedColors, savedFontColors, setSavedFontColors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const updateColors = async (main_colors: string[], font_colors: string[]) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user?.username}/colors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          main_colors,
          font_colors,
        }),
      });
  
      if (!response.ok) {
        console.error("Failed to save colors");
      }
    } catch (err) {
      console.error("Error updating colors:", err);
    }
  };

  const handleDeleteColor = (index: number) => {
    setSavedColors((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      updateColors(updated, savedFontColors);
      return updated;
    });
  };
  
  const handleDeleteFontColor = (index: number) => {
    setSavedFontColors((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      updateColors(savedColors, updated);
      return updated;
    });
  };

  const handleAddColor = () => {
    setSavedColors((prev) => {
      if (prev.includes(newTheme.color)) return prev;
      const updated = [...prev, newTheme.color];
      updateColors(updated, savedFontColors);
      return updated;
    });
  };

  const handleAddFontColor = () => {
    setSavedFontColors((prev) => {
      if (prev.includes(newTheme.font_color)) return prev;
      const updated = [...prev, newTheme.font_color];
      updateColors(savedColors, updated);
      return updated;
    });
  };
  
  return (
    <div className="theme-customizer">
      <div className="tab-row">
        <button 
          className={activeTab === 'color' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('color')}
        >
          Main Color
        </button>
        <button 
          className={activeTab === 'font_color' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('font_color')}
        >
          Font Color
        </button>
        <button 
          className={activeTab === 'image' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('image')}
        >
          Image
        </button>
      </div>

      {activeTab === 'color' && (
        <>
          <div className="color-grid">
            {savedColors.map((color, index) => (
              <div key={index} className="color-box-wrapper">
                <div
                  className="color-box"
                  style={{ backgroundColor: color }}
                  onClick={() => !isEditing && setNewTheme({ ...newTheme, color })}
                />
                {isEditing && (
                  <button
                    className="delete-color-btn"
                    onClick={() => handleDeleteColor(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="color-picker-row">
            <label className="picker-label">New Color:</label>
            <input
              type="color"
              value={newTheme.color}
              onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
            />
            <button
              className="add-color-btn"
              onClick={handleAddColor}
            >
              +
            </button>
            <button className="edit-mode-btn" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? <FaCheck /> : <FaEdit />}
            </button>
          </div>
        </>
      )}

      {activeTab === 'font_color' && (
        <>
          <div className="color-grid">
            {savedFontColors.map((color, index) => (
              <div key={index} className="color-box-wrapper">
                <div
                  className="color-box"
                  style={{ backgroundColor: color }}
                  onClick={() => !isEditing && setNewTheme({ ...newTheme, font_color: color })}
                />
                {isEditing && (
                  <button
                    className="delete-color-btn"
                    onClick={() => handleDeleteFontColor(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="color-picker-row">
            <label className="picker-label">New Color:</label>
            <input
              type="color"
              value={newTheme.font_color}
              onChange={(e) => setNewTheme({ ...newTheme, font_color: e.target.value })}
            />
            <button
              className="add-color-btn"
              onClick={handleAddFontColor}
            >
              +
            </button>
            <button className="edit-mode-btn" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? <FaCheck /> : <FaEdit />}
            </button>
          </div>
        </>
      )}

      {activeTab === 'image' && (
        <div className="image-grid">
          {['guitar_3.png', 'brown.png', 'martin-guitar-decal-gold.png', 'black-guitar2.png'].map((imgName, index) => (
            <img
              key={index}
              src={`/assets/${imgName}`}
              alt={`Theme ${index}`}
              className={`image-box ${newTheme.image === `/assets/${imgName}` ? 'selected' : ''}`}
              onClick={() => setNewTheme({ ...newTheme, image: `/assets/${imgName}` })}
            />
          ))}
        </div>
      )}

      <div className="save-theme-row">
        <button 
          className="save-theme-btn"
          style={{
            backgroundColor: newTheme.color,
            color: newTheme.font_color,
          }}
          onClick={() => {
            handleSaveTheme();
            setActiveTab('color');
          }}
        >
          Save Theme
        </button>

        <button
          className="theme-preview"
          style={{
            backgroundImage: `linear-gradient(135deg, ${newTheme.color} 70%, ${newTheme.font_color} 70%)`,
            border: `2px solid ${newTheme.color}`,
            color: 'transparent',
          }}
          title="Preview"
          disabled
        />
      </div>
    </div>
  );
};

export default ThemeCustomizer;