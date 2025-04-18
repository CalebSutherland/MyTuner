import React from "react";
import "./MenuButton.css";

interface MenuButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onToggle, isOpen }) => {
  return (
    <>
      {!isOpen && (
        <button className="menu-button" onClick={onToggle}>☰</button> // Menu button when the menu is closed
      )}
      
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
    </>
  );
};

export default MenuButton;