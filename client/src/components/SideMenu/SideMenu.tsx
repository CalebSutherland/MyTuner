import React from "react";
import "./SideMenu.css";
import { FaHome, FaGithub} from "react-icons/fa"
import { MdConstruction } from "react-icons/md";

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
        <li><MdConstruction className="menu-icon" /> Coming Soon 1</li>
        <li><MdConstruction className="menu-icon" /> Coming Soon 2</li>
        <li><MdConstruction className="menu-icon" /> Coming Soon 3</li>
        <li><MdConstruction className="menu-icon" /> Coming Soon 4</li>
        <li>
          <a 
            href="https://github.com/CalebSutherland/MyTuner"
            target="_blank" 
            rel="noopener noreferrer"
            className="menu-link"
          >
            <FaGithub className="menu-icon" />
            Github Repo
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu