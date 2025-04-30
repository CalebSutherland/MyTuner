import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import MenuButton from "../components/MenuButton/MenuButton";
import ThemeSelector from "../components/ThemeSelector/ThemeSelector";
import Tuner from "../components/Tuner/Tuner"
import GeneralTuner from "../components/GeneralTuner/GeneralTuner";
import CustomTuner from "../components/CustomTuner/CustomTuner";
import useAudioProcessor from "../hooks/useAudioProcessor";
import { useThemeUtils } from "../hooks/useThemeUtils";
import '../App.css';

const apiUrl = import.meta.env.VITE_API_URL;

type Theme = {
  color: string;
  fontColor: string;
  image: string;
};


function Home() {
  const {
    frequency,
    note,
    status,
    isListening,
    volume,
    startListening,
    stopListening,
  } = useAudioProcessor();

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>("Home");

  const [themes, setThemes] = useState<Theme[]>([
    { color: "#700b0b", fontColor: "#ffffff", image: "/assets/guitar_3.png" },
    { color: "#B302C0", fontColor: "#ffffff", image: "/assets/brown.png" },
    { color: "#00FFFF", fontColor: "#000000", image: "/assets/martin-guitar-decal-gold.png" },
    { color: "#FFFF00", fontColor: "#000000", image: "/assets/black-guitar2.png" },
  ]);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [savedColors, setSavedColors] = useState<string[]>(['#700b0b', '#B302C0', '#00FFFF', '#FFFF00']);
  const [savedFontColors, setSavedFontColors] = useState<string[]>(['#FFFFFF', '#000000']);

  const [customTuning, setCustomTuning] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [savedTunings, setSavedTunings] = useState<(string | null)[][]>([]);

  const { darkenColor, updateMainLight } = useThemeUtils();

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.style.setProperty("--main--color", theme.color);
    document.documentElement.style.setProperty("--hover--color", darkenColor(theme.color, 10));
    document.documentElement.style.setProperty("--font--color", theme.fontColor);
    updateMainLight(theme.color);
  };
  

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="menu-button-container">
          <MenuButton 
            onToggle={toggleMenu} 
            isOpen={showMenu} 
          />
        </div>
        <h1>MyTuner</h1>
        <div className="login-button-container">
          <button
            className="login-button"
            onClick={() => navigate("/login")}>Login</button>
        </div>
      </header>

      <SideMenu
        stopListening={stopListening}
        setDisplay={setDisplay}
        onToggle={toggleMenu} 
        isOpen={showMenu}
      />

      {showMenu && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="App">

        {display == "Home" && (
          <>
            <div className="color-section">
              <ThemeSelector
                themes={themes}
                setThemes={setThemes}
                selectedTheme={selectedTheme}
                applyTheme={applyTheme}
                savedColors={savedColors}
                setSavedColors={setSavedColors}
                savedFontColors={savedFontColors}
                setSavedFontColors={setSavedFontColors}
              />
            </div>

            <Tuner
              note={note}
              frequency={frequency}
              status={status}
              isListening={isListening}
              volume={volume}
              startListening={startListening}
              stopListening={stopListening}
              selectedTheme={selectedTheme}
            />
          </>
        )}

        {display == "General" && (
          <GeneralTuner 
            note={note}
            frequency={frequency}
            status={status}
            isListening={isListening}
            volume={volume}
            startListening={startListening}
            stopListening={stopListening}
          />
        )}

        {display == "Custom" && (
          <CustomTuner 
            note={note}
            frequency={frequency}
            status={status}
            isListening={isListening}
            volume={volume}
            startListening={startListening}
            stopListening={stopListening}
            selectedTheme={selectedTheme}
            customTuning={customTuning}
            setCustomTuning={setCustomTuning}
            savedTunings={savedTunings}
            setSavedTunings={setSavedTunings}
          />
        )}
      </div>
    </>
  );
}

export default Home;