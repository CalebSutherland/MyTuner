import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    // Replace with real auth/signup logic later
    navigate("/");
  };

  return (
    <>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <input type="text" placeholder="Username" /><br /><br />

        <input type="password" placeholder="Password" /><br /><br />

        {!isLogin && (
          <>
            <input type="password" placeholder="Confirm Password" /><br /><br />
          </>
        )}

        <button onClick={handleSubmit}>
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <br /><br />
        <button onClick={() => setIsLogin(!isLogin)} style={{ fontSize: "0.9em" }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </>
  );
};

export default AuthPage;