import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from '../contexts/ThemeContext';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import SideMenu from "../components/SideMenu/SideMenu";
import MenuButton from "../components/MenuButton/MenuButton";
import '../App.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { resetToDefaultThemes } = useTheme();

  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <header className="app-header">
        <div className="menu-button-container">
          <MenuButton onToggle={toggleMenu} isOpen={showMenu} />
        </div>
        <h1>MyTuner</h1>
        <div className="login-button-container">
          {user ? (
            <div className="user-dropdown">
              <button className="login-button" onClick={toggleDropdown}>
                <span className="username">{user.username}</span>
                <span className="arrow">{showDropdown ? <FaAngleUp /> : <FaAngleDown />}</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => { console.log("Signed out", user.username); logout(); navigate("/"); setShowDropdown(false); resetToDefaultThemes(); }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-button no-user"
              onClick={() => navigate(isLoginPage ? "/" : "/login")}
            >
              {isLoginPage ? "Back Home" : "Log In"}
            </button>
          )}
        </div>
      </header>

      <SideMenu onToggle={toggleMenu} isOpen={showMenu} />
      {showMenu && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="App">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;