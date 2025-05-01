import React from "react";
import { useAudio } from "../../contexts/AudioContext";
import "./SideMenu.css";
import { FaHome, FaGithub} from "react-icons/fa"
import { MdConstruction } from "react-icons/md";

interface SideMenuProps {
  onToggle: () => void;
  setDisplay: (dislpay: string) => void;
  isOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ onToggle, setDisplay, isOpen }) => {
  const { stopListening } = useAudio();
  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onToggle}>
        ✖
      </button>
      <ul>
        <li onClick={() => (setDisplay("Home"), onToggle(), stopListening())}>
          <FaHome className="menu-icon" /> Home 
        </li>
        <li onClick={() => (setDisplay("General"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> General
        </li>
        <li onClick={() => (setDisplay("Custom"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> Custom Tuning
        </li>
        <li onClick={() => (setDisplay("Test"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> Coming Soon 3
        </li>
        <li onClick={() => (setDisplay("Test"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> Coming Soon 4
        </li>
        <li>
          <a 
            href="https://github.com/CalebSutherland/MyTuner"
            target="_blank" 
            rel="noopener noreferrer"
            className="menu-link"
          >
            <FaGithub className="menu-icon" /> Github Repo
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu