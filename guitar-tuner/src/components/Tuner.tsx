import React from "react";
import { useState, useRef, useEffect } from "react";
import TuningButtons from "./TuningButtons";
import Visual from "./Visual"
import Stats from "./Stats";
import TuningDropdown from "./TuningDropdown";
import AutoDetect from "./AutoDetect";
import tunings from "../data/all_tunings.js"
import useAudioProcessor from "../hooks/useAudioProcessor.js"

type Tuning = {
  name: string;
  notes: string[];
  values: number[];
};

type Tunings = {
  [category: string]: Tuning[];
};

function Tuner() {
  const {
    frequency,
    note,
    status,
    isListening,
    volume,
    startListening,
    stopListening,
  } = useAudioProcessor();

  const [target, setTarget] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Standard");
  const [selectedTuning, setSelectedTuning] = useState<Tuning>(tunings["Standard"][0])
  const [isAutoDetect, setIsAutoDetect] = useState<boolean>(false);
  const lastDetectedNoteRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const handleTuningChange = (tuningName: string) => {
    const selectedTuningObject = (tunings as Tunings)[selectedCategory].find(
      (t) => t.name === tuningName
    );
    
    if (selectedTuningObject) {
      setSelectedTuning(selectedTuningObject);
      setTarget(0);
    } else {
      console.warn(`Tuning '${tuningName}' not found in category '${selectedCategory}'`);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const firstTuning = (tunings as Tunings)[category]?.[0] || null;
    setSelectedTuning(firstTuning);
    setTarget(0);
  };

  const toggleAutoDetect = () => {
    setIsAutoDetect(!isAutoDetect);
  };

  const detectClosestNote = (freq: number): number => {
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
    if (!isAutoDetect || frequency <= 0) return;

    const closestTarget = detectClosestNote(frequency);

    if(closestTarget !== lastDetectedNoteRef.current) {
      lastDetectedNoteRef.current = closestTarget;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        setTarget(closestTarget);
      }, 1000);
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
        targetDiffernce={frequency === 0 ? 0 : Number((frequency - target).toFixed(0))} 
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