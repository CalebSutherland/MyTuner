import React, { useEffect, useRef } from "react";
import { useTheme } from '../contexts/ThemeContext';
import Target from "./Target";

type Tuning = {
  name: string;
  notes: string[];
  values: number[];
};

type Theme = {
  color: string;
  fontColor: string;
  image: string;
};

type TuningButtonsProps = {
  tuning: Tuning | null;
  target: number;
  changeTarget: (index: number) => void;
  detectedFreq: number;
};

function TuningButtons({ tuning, target, changeTarget, detectedFreq }: TuningButtonsProps) {
  const { selectedTheme } = useTheme();
  const currentPlaying = useRef<HTMLAudioElement | null>(null);
  const audioRefs = useRef<{ [note: string]: HTMLAudioElement }>({});

  const audioFiles = import.meta.glob('../data/guitar_sounds/*.mp3', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;

  useEffect(() => {
    const preloadAudio = async () => {
      if (!tuning) return;
      for (const note of tuning.notes) {
        const translated = note.replace('♯', 'S');
        const key = `../data/guitar_sounds/${translated}.mp3`;
        if (audioFiles[key]) {
          const url = await audioFiles[key]();
          audioRefs.current[note] = new Audio(url);
        }
      }
    };
    preloadAudio();
  }, [tuning]);

  const playSound = (note: string) => {
    if (currentPlaying.current) {
      currentPlaying.current.pause();
      currentPlaying.current.currentTime = 0;
    }

    const audio = audioRefs.current[note];
    if (audio) {
      currentPlaying.current = audio;
      audio.currentTime = 0;
      audio.play();

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        currentPlaying.current = null;
      }, 2000);
    }
  };

  if (!tuning) {
    return null;
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
          <img src={selectedTheme?.image} alt="Guitar" className="guitar-image" />
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
              playSound={playSound}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TuningButtons;