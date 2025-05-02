import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const apiUrl = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    setErrorMessage(""); // Clear error message

    const url = isLogin ? `${apiUrl}/api/login` : `${apiUrl}/api/signup`;
    const payload = { username, password, confirmPassword };

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
        console.log(data.message); // Log success message

        // If login is successful, store token
        if (isLogin) {
          login(data.token, username);
          navigate("/"); // Redirect to home page after login
        } else {
          // Redirect to login page after successful sign-up
          setIsLogin(true);
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