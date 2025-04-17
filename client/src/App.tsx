import React, { useEffect, useState } from "react";
import Tuner from "./components/Tuner/Tuner"
import MenuButton from "./components/MenuButton/MenuButton";
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <MenuButton onToggle={toggleMenu} isOpen={showMenu} />
        <h1>MyTuner</h1>
      </header>
      <div>
        <Tuner />
      </div>
    </div>
  );
}

export default App
