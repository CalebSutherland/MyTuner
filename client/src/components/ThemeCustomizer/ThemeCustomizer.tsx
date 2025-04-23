import React, { useState } from "react";
import './ThemeCustomizer.css'

type Theme = {
  color: string;
  fontColor: string;
};

type ThemeCustomizerProps = {
  newTheme: Theme;
  setNewTheme: (theme: Theme) => void;
  activeTab: 'color' | 'fontColor' | 'image';
  setActiveTab: (tab: 'color' | 'fontColor' | 'image') => void;
  handleSaveTheme: () => void;
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  newTheme,
  setNewTheme,
  activeTab,
  setActiveTab,
  handleSaveTheme
}) => {
  const [savedColors, setSavedColors] = useState<string[]>(['#FF5733', '#33FF57', '#3357FF']);
  const [savedFontColors, setSavedFontColors] = useState<string[]>(['#FFFFFF', '#000000']);

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
          className={activeTab === 'fontColor' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('fontColor')}
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
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: color }}
                onClick={() => setNewTheme({ ...newTheme, color })}
              />
            ))}
            <button
              className="add-color-btn"
              onClick={() =>
                setSavedColors((prev) =>
                  prev.includes(newTheme.color) ? prev : [...prev, newTheme.color]
                )
              }
            >
              +
            </button>
          </div>
          <div className="color-picker-row">
            <label className="picker-label">New Color:</label>
            <input
              type="color"
              value={newTheme.color}
              onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
            />
          </div>
        </>
      )}

      {activeTab === 'fontColor' && (
        <>
          <div className="color-grid">
            {savedFontColors.map((color, index) => (
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: color }}
                onClick={() => setNewTheme({ ...newTheme, fontColor: color })}
              />
            ))}
            <button
              className="add-color-btn"
              onClick={() =>
                setSavedFontColors((prev) =>
                  prev.includes(newTheme.fontColor) ? prev : [...prev, newTheme.fontColor]
                )
              }
            >
              +
            </button>
          </div>
          <div className="color-picker-row">
            <label className="picker-label">New Color:</label>
            <input
              type="color"
              value={newTheme.fontColor}
              onChange={(e) => setNewTheme({ ...newTheme, fontColor: e.target.value })}
            />
          </div>
        </>
      )}

      {activeTab === 'image' && (
        <p style={{ color: 'white' }}>Image selection coming soon!</p>
      )}

      <div className="save-theme-row">
        <button 
          className="save-theme-btn"
          style={{
            backgroundColor: newTheme.color,
            color: newTheme.fontColor,
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
            backgroundImage: `linear-gradient(135deg, ${newTheme.color} 70%, ${newTheme.fontColor} 70%)`,
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