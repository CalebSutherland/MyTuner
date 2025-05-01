import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <-- import the provider
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import GeneralPage from './pages/GeneralPage';
import CustomPage from './pages/CustomPage';
import Layout from './pages/Layout';

function App() {
  return (
    <AudioProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="general" element={<GeneralPage />} />
              <Route path="custom" element={<CustomPage />} />
              <Route path="login" element={<AuthPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AudioProvider>
  );
}

export default App;