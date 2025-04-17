import React from "react"
import { useEffect } from "react";
import Tuner from "./components/Tuner/Tuner"
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  useEffect(() => {
    fetch(`${apiUrl}/api/ping`)
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
    <div className="App">
      <h1>MyTuner</h1>
      <div>
      <Tuner />
      </div>
    </div>
  )
}

export default App
