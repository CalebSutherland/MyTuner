import React from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../../contexts/AudioContext";
import "./SideMenu.css";
import { FaHome, FaGithub } from "react-icons/fa";
import { PiMetronome } from "react-icons/pi";
import { MdConstruction, MdDashboardCustomize, MdTune } from "react-icons/md";

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
        <li onClick={() => (navigate("metronome"), onToggle(), stopListening())}>
          <PiMetronome className="menu-icon" /> Metronome
        </li>
        <li onClick={() => (navigate("/general"), onToggle(), stopListening())}>
          <MdTune className="menu-icon" /> General Tuner
        </li>
        <li onClick={() => (navigate("/custom"), onToggle(), stopListening())}>
          <MdDashboardCustomize className="menu-icon" /> Custom Tuning
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