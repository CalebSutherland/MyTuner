import React from "react";
import "./MenuButton.css"; // Optional, or just keep styles in App.css

interface MenuButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onToggle, isOpen }) => {
  return (
    <>
      <button className="menu-button" onClick={onToggle}>☰</button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>Placeholder 1</li>
            <li>Placeholder 2</li>
            <li>Placeholder 3</li>
            <li>Placeholder 4</li>
            <li>Placeholder 5</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuButton;