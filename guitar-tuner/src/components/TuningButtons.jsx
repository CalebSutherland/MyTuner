import React from 'react';
import { useState, useRef } from "react";
import Target from "./Target.jsx";
import guitarImage from '../assets/guitar_3.png'

function TuningButtons({ tuning, target, changeTarget, detectedFreq }) {
  const currentPlaying = useRef(null);

  const playSound = async (note, audioRefs, getAudioUrl) => { // Added getAudioUrl as a parameter
    // Stop the currently playing sound (if any)
    if (currentPlaying.current) {
      currentPlaying.current.pause();
      currentPlaying.current.currentTime = 0;
    }

    if (audioRefs.current[note]) {
      const audio = audioRefs.current[note];
      currentPlaying.current = audio;
      audio.currentTime = 0;
      audio.play();

      setTimeout(() => {
        if (audio.currentTime > 0) {
          audio.pause();
          audio.currentTime = 0;
          currentPlaying.current = null;
        }
      }, 2000);
    } else {
      const url = await getAudioUrl(note); // Get the URL from the Target component
      if (url) {
        audioRefs.current[note] = new Audio(url);
        currentPlaying.current = audioRefs.current[note];
        audioRefs.current[note].play();

        setTimeout(() => {
          if (audioRefs.current[note].currentTime > 0) {
            audioRefs.current[note].pause();
            audioRefs.current[note].currentTime = 0;
            currentPlaying.current = null;
          }
        }, 2000);
      }
    }
  };

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
              playSound={playSound} // Pass playSound down
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
              playSound={playSound} // Pass playSound down
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TuningButtons;