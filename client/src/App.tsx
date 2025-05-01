import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext"; // <-- import the provider
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <AudioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
    </AudioProvider>
  );
}

export default App;