import { useState, useEffect } from "react";

function Target({ note, value, updateTarget, detectedFrequency, target }) {
  const [isInTune, setIsInTune] = useState(false);

  // Check if the detected frequency is within 3 Hz
  useEffect(() => {
    if (Math.abs(detectedFrequency - value) <= 3 && value === target) {
      setIsInTune(true); // Permanently set to true once it's in range
    }
  }, [detectedFrequency, value]);

  return (
    <button 
      className={`tuning-button ${isInTune ? "in-tune" : ""}`}
      onClick={() => updateTarget(value)}
    >
      {note}
    </button>
  )
}

export default Target;