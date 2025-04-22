import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu/SideMenu";
import MenuButton from "./components/MenuButton/MenuButton";
import Tuner from "./components/Tuner/Tuner"
import GeneralTuner from "./components/GeneralTuner/GeneralTuner";
import CustomTuner from "./components/CustomTuner/CustomTuner";
import useAudioProcessor from "./hooks/useAudioProcessor";
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (Math.max(0, R) << 16) +
      (Math.max(0, G) << 8) +
      Math.max(0, B)
    )
      .toString(16)
      .slice(1)
  );
}

function updateMainLight(hex: string) {
  const num = parseInt(hex.slice(1), 16);
  const R = (num >> 16) & 0xff;
  const G = (num >> 8) & 0xff;
  const B = num & 0xff;

  // Count how many components are 240 or higher
  let brightCount = 0;
  if (R >= 225) brightCount++;
  if (G >= 225) brightCount++;
  if (B >= 225) brightCount++;

  let lightValue = "rgba(255, 255, 255, 0.1)";
  if (brightCount === 1) {
    lightValue = "rgba(255, 255, 255, 0.3)";
  } else if (brightCount >= 2) {
    lightValue = "rgba(255, 255, 255, 0.5)";
  }

  document.documentElement.style.setProperty("--main--light", lightValue);
}

function App() {
  const {
    frequency,
    note,
    status,
    isListening,
    volume,
    startListening,
    stopListening,
  } = useAudioProcessor();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>("Home");
  const [themeColor, setThemeColor] = useState("#700b0b");

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  useEffect(() => {
    const picker = document.getElementById("colorPicker") as HTMLInputElement | null;
  
    if (picker) {
      const updateColors = () => {
        const mainColor = picker.value;
        const hoverColor = darkenColor(mainColor, 10);
  
        document.documentElement.style.setProperty("--main--color", mainColor);
        document.documentElement.style.setProperty("--hover--color", hoverColor);
        updateMainLight(mainColor);
      };
  
      picker.addEventListener("input", updateColors);
  
      // Set initial colors
      updateColors();
    }
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
        <div className="spacer" />
      </header>

      <SideMenu
        stopListening={stopListening}
        setDisplay={setDisplay}
        onToggle={toggleMenu} 
        isOpen={showMenu}
      />

      {showMenu && <div className="overlay" onClick={toggleMenu}></div>}

      <input
        type="color"
        id="colorPicker"
        value={themeColor}
        onChange={(e) => setThemeColor(e.target.value)}
      />

      <div className="App">
          {display == "Home" && (
            <Tuner
              note={note}
              frequency={frequency}
              status={status}
              isListening={isListening}
              volume={volume}
              startListening={startListening}
              stopListening={stopListening}
            />
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
            />
          )}
      </div>
    </>
  );
}

export default App
