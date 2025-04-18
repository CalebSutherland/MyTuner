import React from "react";
import "./SideMenu.css";
import { FaHome } from "react-icons/fa"

interface SideMenuProps {
  onToggle: () => void;
  isOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ onToggle, isOpen }) => {
  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onToggle}>
        ✖
      </button>
      <ul>
        <li><FaHome className="menu-icon" /> Home </li>
        <li><FaHome className="menu-icon" /> Coming Soon 2</li>
        <li><FaHome className="menu-icon" /> Coming Soon 3</li>
        <li><FaHome className="menu-icon" /> Coming Soon 4</li>
        <li><FaHome className="menu-icon" /> Coming Soon 5</li>
        <li><FaHome className="menu-icon" /> Coming Soon 6</li>
      </ul>
    </div>
  );
};

export default SideMenu