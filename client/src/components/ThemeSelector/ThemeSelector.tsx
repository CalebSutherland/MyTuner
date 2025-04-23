import React, { useState} from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import './ThemeSelector.css';

type Theme = {
  color: string;
  fontColor: string;
};

const ThemeSelector: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([
    { color: "#700b0b", fontColor: "#ffffff" },
    { color: "#B302C0", fontColor: "#ffffff" },
    { color: "#00FFFF", fontColor: "#000000" },
    { color: "#FFFF00", fontColor: "#000000"},
  ]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>({ color: "#700b0b", fontColor: "#ffffff" });
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [newTheme, setNewTheme] = useState<Theme>({
    color: "#0B8948",
    fontColor: "#ffffff",
  });
  const [activeTab, setActiveTab] = useState<'color' | 'fontColor' | 'image'>('color');

  const { darkenColor, updateMainLight } = useThemeUtils();

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.fontColor);
    updateMainLight(theme.color);
  };

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
          onClick={() => setShowCustomizer(prev => !prev)}
        >
          {showCustomizer ? '×' : '+'}
        </button>
      </div>
  
      {showCustomizer && (
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
              <input
                type="color"
                value={selectedTheme?.color}
                onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
              />
            )}
          
            {activeTab === 'fontColor' && (
              <input
                type="color"
                value={selectedTheme?.fontColor}
                onChange={(e) => setNewTheme({ ...newTheme, fontColor: e.target.value })}
              />
            )}
          
            {activeTab === 'image' && (
              <p style={{ color: 'white' }}>Image selection coming soon!</p>
            )}
          
            <button 
              className="save-theme-btn" 
              onClick={handleSaveTheme}
            >
              Save Theme
            </button>

        </div>
      )}
    </div>
  );
};

export default ThemeSelector;