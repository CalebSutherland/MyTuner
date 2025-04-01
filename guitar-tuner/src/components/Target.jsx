import { useState, useEffect, useRef } from "react";

function Target({ note, value, updateTarget, detectedFrequency, target, playSound }) {
  const [isInTune, setIsInTune] = useState(false);
  const audioRefs = useRef({}); // Initialize as an empty object

  const audioFiles = import.meta.glob('../data/guitar_sounds/*.mp3', { query: '?url', import: 'default' });

  const getAudioUrl = async (note) => {
    const translatedNote = note.replace('♯', 'S');
    if (audioFiles[`../data/guitar_sounds/${translatedNote}.mp3`]) {
      return await audioFiles[`../data/guitar_sounds/${translatedNote}.mp3`]();
    }
    return null;
  };

  // Check if the detected frequency is within 3 Hz
  useEffect(() => {
    if (Math.abs(detectedFrequency - value) <= 3 && value === target) {
      setIsInTune(true); // Permanently set to true once it's in range
    }
  }, [detectedFrequency, value]);

  return (
    <button 
      className={`tuning-button ${isInTune ? "in-tune" : ""} ${value === target ? "is-target" : ""}`}
      onClick={() => {
        updateTarget(value)
        playSound(note, audioRefs, getAudioUrl);
      }}
    >
      {note}
    </button>
  )
}

export default Target;