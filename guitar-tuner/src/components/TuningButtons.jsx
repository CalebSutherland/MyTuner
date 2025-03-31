import React from 'react';
import Target from "./Target.jsx";
import guitarImage from '../assets/guitar_3.png'

function TuningButtons({ tuning, target, changeTarget, detectedFreq }) {
  if (!tuning) {
    return null; // or return <div>No tuning selected</div>
  }

  const leftButtons = tuning.notes.slice(0, 3);
  const rightButtons = tuning.notes.slice(3);

  return (
    <div className="tuning-layout-container">
      <p style={{ fontWeight: 500 }}>{tuning.name}</p>
      <div className="tuning-content">
        <div className="left-buttons">
          {leftButtons.map((note, index) => (
            <Target
              key={`${tuning.name}-${note}-${index}`}
              value={tuning.values[index]}
              note={note}
              target={target}
              detectedFrequency={detectedFreq}
              updateTarget={changeTarget}
            />
          ))}
        </div>
        <img src={guitarImage} alt="Guitar" className="guitar-image" />
        <div className="right-buttons">
          {rightButtons.map((note, index) => (
            <Target
              key={`${tuning.name}-${rightButtons[index]}-${index + 3}`} // Adjusted key
              value={tuning.values[index + 3]}
              note={rightButtons[index]}
              target={target}
              detectedFrequency={detectedFreq}
              updateTarget={changeTarget}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TuningButtons;