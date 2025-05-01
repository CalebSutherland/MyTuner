import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import MenuButton from "../components/MenuButton/MenuButton";
import '../App.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
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
          <button
            className="login-button"
            onClick={() => navigate(isLoginPage ? "/" : "/login")}
          >
            {isLoginPage ? "Back Home" : "Log In"}
          </button>
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