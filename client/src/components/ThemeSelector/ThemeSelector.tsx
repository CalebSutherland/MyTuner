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
    { color: "#3502C0", fontColor: "#ffffff" },
    { color: "#B302C0", fontColor: "#ffffff" },
  ]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [newTheme, setNewTheme] = useState<Theme>({
    color: "#0B8948",
    fontColor: "#ffffff",
  });

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
              backgroundColor: theme.color,
              color: theme.fontColor,
            }}
            onClick={() => applyTheme(theme)}
          />
        ))}
        <button className="add-theme-btn" onClick={() => setShowCustomizer(true)}>+</button>
      </div>
  
      {showCustomizer && (
        <div className="theme-customizer">
          <label>Main Color</label>
          <input
            type="color"
            value={newTheme.color}
            onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
          />
  
          <label>Font Color</label>
          <input
            type="color"
            value={newTheme.fontColor}
            onChange={(e) => setNewTheme({ ...newTheme, fontColor: e.target.value })}
          />

          <label>Image</label>
  
          <button className="save-theme-btn" onClick={handleSaveTheme}>Save Theme</button>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;