import React from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../../contexts/AudioContext";
import "./SideMenu.css";
import { FaHome, FaGithub} from "react-icons/fa"
import { MdConstruction } from "react-icons/md";

interface SideMenuProps {
  onToggle: () => void;
  isOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ onToggle, isOpen }) => {
  const { stopListening } = useAudio();
  const navigate = useNavigate();
  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onToggle}>
        ✖
      </button>
      <ul>
        <li onClick={() => (navigate("/"), onToggle(), stopListening())}>
          <FaHome className="menu-icon" /> Home 
        </li>
        <li onClick={() => (navigate("/general"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> General
        </li>
        <li onClick={() => (navigate("/custom"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> Custom Tuning
        </li>
        <li onClick={() => (navigate("/"), onToggle(), stopListening())}>
          <MdConstruction className="menu-icon" /> Coming Soon 3
        </li>
        <li onClick={() => (navigate("/"), onToggle(), stopListening())}>
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