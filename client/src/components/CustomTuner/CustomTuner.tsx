import React, { useState } from "react";
import CTSelector from "../CTSelector/CTSelector";
import CTButtons from "../CTButtons/CTButtons";
import StartTuning from "../StartTuning/StartTuning";
import Visual from "../Visual/Visual";
import Stats from "../Stats/Stats";
import "./CustomTuner.css";

interface CustomTunerProps {
  frequency: number;
  note: string | null;
  status: string;
  isListening: boolean;
  volume: number;
  startListening: () => void;
  stopListening: () => void;
}

function CustomTuner({frequency, note, status, isListening, volume, startListening, stopListening}:CustomTunerProps) {
  const [target, setTarget] = useState<number>(0);
  const [customTuning, setCustomTuning] = useState<(string | null)[]>([null, null, null, null, null, null]);

  const handleTuningChange = (tuning: (string | null)[]) => {
    setCustomTuning(tuning);
    console.log("Tuning update:", tuning);
  };

  return (
    <>
      <div className="cust-tun-btn-container">
        <CTSelector
          tuning={customTuning} 
          onTuningChange={handleTuningChange}
        />
      </div>      

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