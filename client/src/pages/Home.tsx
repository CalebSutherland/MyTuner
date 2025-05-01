import React, { useEffect, useState } from "react";
import ThemeSelector from "../components/ThemeSelector/ThemeSelector";
import Tuner from "../components/Tuner/Tuner"
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { selectedTheme } = useTheme();
  const [savedColors, setSavedColors] = useState<string[]>(['#700b0b', '#B302C0', '#00FFFF', '#FFFF00']);
  const [savedFontColors, setSavedFontColors] = useState<string[]>(['#FFFFFF', '#000000']);

  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
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
  );
}

export default Home;