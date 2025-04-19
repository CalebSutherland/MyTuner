import React from 'react';
import { useRef } from "react";
import Target from "./Target";
import guitarImage from '../assets/guitar_3.png'

type Tuning = {
  name: string;
  notes: string[];
  values: number[];
};

type TuningButtonsProps = {
  tuning: Tuning | null;
  target: number;
  changeTarget: (index: number) => void;
  detectedFreq: number;
};

function TuningButtons({ tuning, target, changeTarget, detectedFreq }: TuningButtonsProps) {
  const currentPlaying = useRef<HTMLAudioElement | null>(null);
  const audioRefs = useRef<{ [note: string]: HTMLAudioElement }>({});

  const playSound = async (
    note: string,
    audioRefs: React.RefObject<{ [note: string]: HTMLAudioElement }>,
    getAudioUrl: (note: string) => Promise<string | null>
  ) => { 
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
        const newAudio = new Audio(url);
        audioRefs.current[note] = newAudio;
        currentPlaying.current = newAudio;
        newAudio.play();

        setTimeout(() => {
          if (newAudio.currentTime > 0) {
            newAudio.pause();
            newAudio.currentTime = 0;
            currentPlaying.current = null;
          }
        }, 2000);
      }
    }
  };

  if (!tuning) {
    return null; // or return <div>No tuning selected</div>
  }

  const leftButtons = tuning.notes.slice(0, 3).reverse();
  const rightButtons = tuning.notes.slice(3);

  return (
    <div className="tuning-layout-container">
      <p className="tuning-name-label">{tuning.name}</p>
      <div className="tuning-content">
        <div className="left-buttons">
          {leftButtons.map((note) => {
            const noteIndex = tuning.notes.indexOf(note);
            return (
              <Target
                key={`${tuning.name}-${note}-${noteIndex}`}
                value={tuning.values[noteIndex]}
                note={note}
                target={target}
                detectedFrequency={detectedFreq}
                updateTarget={changeTarget}
                playSound={playSound}
              />
            );
          })}
        </div>
        <div className="guitar-image-container">
          <img src={guitarImage} alt="Guitar" className="guitar-image" />
        </div>
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