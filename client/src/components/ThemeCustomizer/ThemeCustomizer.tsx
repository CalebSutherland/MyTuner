import React from "react";
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
        <input
          type="color"
          value={newTheme.color}
          onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
        />
      )}

      {activeTab === 'fontColor' && (
        <input
          type="color"
          value={newTheme.fontColor}
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
  );
};

export default ThemeCustomizer;