import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu/SideMenu";
import MenuButton from "./components/MenuButton/MenuButton";
import Tuner from "./components/Tuner/Tuner"
import GeneralTuner from "./components/GeneralTuner/GeneralTuner";
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>("Home")

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
        <div className="spacer" />
      </header>

      <SideMenu
        setDisplay={setDisplay}
        onToggle={toggleMenu} 
        isOpen={showMenu}
      />

      {showMenu && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="App">
          {display == "Home" && (
            <Tuner />
          )}

          {display == "General" && (
            <GeneralTuner />
          )}
      </div>
    </>
  );
}

export default App
