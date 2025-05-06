import React from 'react';
import notes from '../../data/all_notes';
import "./CTButtons.css";
import { useTheme } from '../../contexts/ThemeContext';

type CTButtonsProps = {
  tuning: (string | null)[];
  target: number;
  setTarget: (freq: number) => void;
};

function CTButtons({ tuning, target, setTarget }: CTButtonsProps) {
  const { selectedTheme } = useTheme();

  const handleButtonClick = (note: string) => {
    if (note === "--") {
      setTarget(0);
    } else {
      const freq = notes[note as keyof typeof notes];
      setTarget(freq);
    }
  };

  const displayTuning = tuning.map(note => note === null ? "--" : note);

  const leftButtons = displayTuning.slice(0, 3).reverse();
  const rightButtons = displayTuning.slice(3);

  return (
    <div className="tuning-layout-container">
      <div className="tuning-content">
        <div className="left-buttons">
          {leftButtons.map((note, index) => {
            let value = 0;
            if (note === "--") {
              value = -Infinity
            } else {
              const freq = notes[note as keyof typeof notes];
              value = freq;
            }
            return(
              <button
              key={index}
              className={`tuning-button ${value === target ? "is-target" : ""}`}
              onClick={() => handleButtonClick(note)}
              >
              {note}
              </button>
            )
          })}
        </div>
        <div className="guitar-image-container">
          <img src={selectedTheme!.image} alt="Guitar" className="guitar-image" />
        </div>
        <div className="right-buttons">
        {rightButtons.map((note, index) => {
            let value = 0;
            if (note === "--") {
              value = -Infinity
            } else {
              const freq = notes[note as keyof typeof notes];
              value = freq;
            }
            return(
              <button
              key={index}
              className={`tuning-button ${value === target ? "is-target" : ""}`}
              onClick={() => handleButtonClick(note)}
              >
              {note}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default CTButtons;