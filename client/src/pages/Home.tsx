import React, { useEffect } from "react";
import ThemeSelector from "../components/ThemeSelector/ThemeSelector";
import Tuner from "../components/Tuner/Tuner"
import '../App.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
    <>
      <div className="color-section">
        <ThemeSelector />
      </div>
      <Tuner />
    </>
  );
}

export default Home;