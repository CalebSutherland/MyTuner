import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from "../contexts/ThemeContext";
import './AuthPage.css';

const apiUrl = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { themes, selectedTheme, savedColors, savedFontColors } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  let selectedThemeIndex = null;
  if (selectedTheme && Array.isArray(themes)) {
    selectedThemeIndex = themes.findIndex(
      theme =>
        theme.color === selectedTheme.color &&
        theme.font_color === selectedTheme.font_color &&
        theme.image === selectedTheme.image
    );
  }

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    // If it's not a login, check if passwords match
    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    const url = isLogin ? `${apiUrl}/api/login` : `${apiUrl}/api/signup`;
    const payload = isLogin 
      ? { username, password } 
      : { 
          username, 
          password, 
          confirmPassword,
          themes,
          selectedThemeIndex,
          main_colors: savedColors,
          font_colors: savedFontColors
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        if (isLogin) {
          login(data.token, data.username);
          navigate("/"); 
        } else {
          setIsLogin(true);
          setErrorMessage("Account created successfully!");
        }
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <input
          type="text"
          placeholder="Username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button onClick={handleSubmit} className="submit-btn">
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;