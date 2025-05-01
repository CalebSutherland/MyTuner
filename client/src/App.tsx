import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <-- import the provider
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AudioProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AudioProvider>
  );
}

export default App;