import { useState, useRef, useEffect } from "react";
import TuningButtons from "./TuningButtons.jsx";
import Visual from "./Visual"
import Stats from "./Stats.jsx";
import TuningDropdown from "./TuningDropdown.jsx";
import AutoDetect from './AutoDetect.jsx';
import tunings from "../data/all_tunings.js"
import useAudioProcessor from "../hooks/useAudioProcessor.js"

function Tuner() {
  const { frequency, note, status, isListening, volume, startListening, stopListening } = useAudioProcessor();
  const [target, setTarget] = useState(0);
  const [selectedTuning, setSelectedTuning] = useState(tunings["Standard"][0]);
  const [selectedCategory, setSelectedCategory] = useState("Standard");
  const [isAutoDetect, setIsAutoDetect] = useState(false);

  const handleTuningChange = (tuningName) => {
    const selectedTuningObject = tunings[selectedCategory].find((t) => t.name === tuningName);
    setSelectedTuning(selectedTuningObject);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (tunings[category] && tunings[category].length > 0) {
      setSelectedTuning(tunings[category][0]);
    } else {
      setSelectedTuning(null);
    }
  };

  const toggleAutoDetect = () => {
    setIsAutoDetect(!isAutoDetect);
  };

  const detectClosestNote = (freq) => {
    if (!selectedTuning) return 0;

    let closestNote = selectedTuning.values[0];
    let minDiff = Math.abs(freq - selectedTuning.values[0]);

    selectedTuning.values.forEach((val) => {
      const diff = Math.abs(freq - val);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = val;
      }
    });

    return closestNote;
  };

  useEffect(() => {
    if (isAutoDetect && frequency > 0) {
      const closestTarget = detectClosestNote(frequency);
      setTarget(closestTarget);
    }
  }, [isAutoDetect, frequency, selectedTuning]);

  return (
    <>
      <TuningDropdown
        tunings={tunings}
        selectedTuning={selectedTuning}
        onTuningChange={handleTuningChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <button className={`start-button ${isListening ? "listening" : ""}`} 
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? "Stop Tuning" : "Start Tuning"}
      </button>

      <Visual 
        target={target} 
        targetDiffernce={frequency === 0 ? 0 : (frequency - target).toFixed(0)} 
        volume={volume} 
      />

      <AutoDetect 
        isAutoDetect={isAutoDetect} 
        toggleAutoDetect={toggleAutoDetect} 
      />

      <TuningButtons 
        tuning={selectedTuning} 
        changeTarget={setTarget} 
        detectedFreq={frequency} 
        target={target} 
      />

      <Stats 
        frequency={frequency}
        note={note}
        status={status} 
        volume={volume} 
        target={target} 
      />
    </>
  );
}

export default Tuner;