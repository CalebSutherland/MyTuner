import React from "react";
import "./SideMenu.css";

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
        <li>Placeholder 1</li>
        <li>Placeholder 2</li>
        <li>Placeholder 3</li>
        <li>Placeholder 4</li>
        <li>Placeholder 5</li>
      </ul>
    </div>
  );
};

export default SideMenu