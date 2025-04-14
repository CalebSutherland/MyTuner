import { useState, useEffect, useRef } from "react";

function Target({ note, value, updateTarget, detectedFrequency, target, playSound }) {
  const [tuningStatus, setTuningStatus] = useState("out");
  const inRangeSinceRef = useRef(null);
  const lastDesiredStatusRef = useRef(null);
  const audioRefs = useRef({}); // Initialize as an empty object

  const audioFiles = import.meta.glob('../data/guitar_sounds/*.mp3', { query: '?url', import: 'default' });

  const getAudioUrl = async (note) => {
    const translatedNote = note.replace('♯', 'S');
    if (audioFiles[`../data/guitar_sounds/${translatedNote}.mp3`]) {
      return await audioFiles[`../data/guitar_sounds/${translatedNote}.mp3`]();
    }
    return null;
  };

  useEffect(() => {
    if (value !== target) return;
  
    const diff = Math.abs(detectedFrequency - value);
    console.log("Frequency difference:", diff);
    const now = Date.now();

    let desiredStatus = "out";
    if (diff <= 1) {
      desiredStatus = "in";
    } else if (diff <= 5) {
      desiredStatus = "close";
    }

    console.log(`Desired status: ${desiredStatus}`);

    if (tuningStatus !== "in" && desiredStatus !== "out") {
      if (!inRangeSinceRef.current) {
        inRangeSinceRef.current = now;
      }
    
      // Only reset the timer if the desiredStatus actually changed
      if (desiredStatus !== lastDesiredStatusRef.current) {
        inRangeSinceRef.current = now;
        lastDesiredStatusRef.current = desiredStatus;
      }
    
      if (now - inRangeSinceRef.current >= 500) {
        setTuningStatus(desiredStatus);
        console.log(`Upgrading status to: ${desiredStatus}`);
      }
    } else {
      inRangeSinceRef.current = null;
      lastDesiredStatusRef.current = null;
    }
  }, [detectedFrequency, value, target, tuningStatus]);

  return (
    <button 
      className={`tuning-button ${tuningStatus} ${value === target ? "is-target" : ""}`}
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