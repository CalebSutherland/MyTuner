import React from "react";
import "./MenuButton.css";

interface MenuButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onToggle, isOpen }) => {
  return (
    <div>
        <button 
          className={`menu-button ${isOpen ? "hidden" : ""}`}  
          onClick={onToggle}
        >
          ☰
        </button>
    </div>
  );
};

export default MenuButton;