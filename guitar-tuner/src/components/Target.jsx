import { useState, useEffect, useRef } from "react";
import E2Sound from "../data/guitar_sounds/E2.mp3"
import A2Sound from "../data/guitar_sounds/A2.mp3"
import D3Sound from "../data/guitar_sounds/D3.mp3"
import G3Sound from "../data/guitar_sounds/G3.mp3"
import B3Sound from "../data/guitar_sounds/B3.mp3"
import E4Sound from "../data/guitar_sounds/E4.mp3"

function Target({ note, value, updateTarget, detectedFrequency, target, playSound }) {
  const [isInTune, setIsInTune] = useState(false);
  const audioRefs = useRef({
    E2: new Audio(E2Sound),
    A2: new Audio(A2Sound),
    D3: new Audio(D3Sound),
    G3: new Audio(G3Sound),
    B3: new Audio(B3Sound),
    E4: new Audio(E4Sound),
  });

  // Check if the detected frequency is within 3 Hz
  useEffect(() => {
    if (Math.abs(detectedFrequency - value) <= 3 && value === target) {
      setIsInTune(true); // Permanently set to true once it's in range
    }
  }, [detectedFrequency, value]);

  return (
    <button 
      className={`tuning-button ${isInTune ? "in-tune" : ""}`}
      onClick={() => {
        updateTarget(value)
        playSound(note, audioRefs);
      }}
    >
      {note}
    </button>
  )
}

export default Target;