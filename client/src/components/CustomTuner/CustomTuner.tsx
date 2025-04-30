import React, { useState } from "react";
import CTList from "../CTList/CTList";
import CTSelector from "../CTSelector/CTSelector";
import CTButtons from "../CTButtons/CTButtons";
import StartTuning from "../StartTuning/StartTuning";
import Visual from "../Visual/Visual";
import Stats from "../Stats/Stats";
import "./CustomTuner.css";

type Theme = {
  color: string;
  fontColor: string;
  image: string;
};

interface CustomTunerProps {
  frequency: number;
  note: string | null;
  status: string;
  isListening: boolean;
  volume: number;
  startListening: () => void;
  stopListening: () => void;
  selectedTheme: Theme;
  customTuning: (string | null)[];
  setCustomTuning: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  savedTunings: (string | null)[][];
  setSavedTunings: React.Dispatch<React.SetStateAction<(string | null)[][]>>;
}

function CustomTuner({
  frequency, 
  note, 
  status, 
  isListening, 
  volume, 
  startListening, 
  stopListening, 
  selectedTheme,
  customTuning,
  setCustomTuning,
  savedTunings,
  setSavedTunings
}:CustomTunerProps) {

  const [target, setTarget] = useState<number>(0);

  const handleTuningChange = (tuning: (string | null)[]) => {
    setCustomTuning(tuning);
    console.log("Tuning update:", tuning);
  };

  const saveCurrentTuning = () => {
    setSavedTunings(prev => [...prev, [...customTuning]]);
  };

  const loadTuning = (tuning: (string | null)[]) => {
    setCustomTuning(tuning);
  };

  const deleteTuning = (indexToDelete: number) => {
    setSavedTunings(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <>
      <StartTuning
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />

      <Visual 
        target={target} 
        targetDiffernce={frequency === 0 ? 0 : Number((frequency - target).toFixed(0))} 
        volume={volume} 
      />

      <CTButtons 
        tuning={customTuning}
        target={target}
        setTarget={setTarget}
        selectedTheme={selectedTheme}
      />

      <div className="cust-tun-btn-container">
        <CTSelector
          tuning={customTuning} 
          onTuningChange={handleTuningChange}
        />
      </div>

      <div className="save-btn-container">
        <button onClick={saveCurrentTuning} className="start-button">
          Save Tuning
        </button>
      </div>

      <CTList
        savedTunings={savedTunings}
        loadTuning={loadTuning}
        deleteTuning={deleteTuning}
      />

      <Stats 
        frequency={frequency}
        note={note}
        status={status} 
        volume={volume} 
        target={target} 
      />
    </>
  )
}

export default CustomTuner;