import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import MenuButton from "../components/MenuButton/MenuButton";
import ThemeSelector from "../components/ThemeSelector/ThemeSelector";
import Tuner from "../components/Tuner/Tuner"
import GeneralTuner from "../components/GeneralTuner/GeneralTuner";
import CustomTuner from "../components/CustomTuner/CustomTuner";
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const { selectedTheme } = useTheme();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>("Home");

  const [savedColors, setSavedColors] = useState<string[]>(['#700b0b', '#B302C0', '#00FFFF', '#FFFF00']);
  const [savedFontColors, setSavedFontColors] = useState<string[]>(['#FFFFFF', '#000000']);

  const [customTuning, setCustomTuning] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [savedTunings, setSavedTunings] = useState<(string | null)[][]>([]);

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
            onClick={() => navigate("/login")}>Log In</button>
        </div>
      </header>

      <SideMenu
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
                savedColors={savedColors}
                setSavedColors={setSavedColors}
                savedFontColors={savedFontColors}
                setSavedFontColors={setSavedFontColors}
              />
            </div>

            <Tuner
              selectedTheme={selectedTheme}
            />

          </>
        )}

        {display == "General" && (
          <GeneralTuner />
        )}

        {display == "Custom" && (
          <CustomTuner 
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