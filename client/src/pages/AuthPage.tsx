import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    // Replace with real auth/signup logic later
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <input type="text" placeholder="Username" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        
        {!isLogin && (
          <input type="password" placeholder="Confirm Password" className="auth-input" />
        )}

        <button onClick={handleSubmit} className="submit-btn">
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;