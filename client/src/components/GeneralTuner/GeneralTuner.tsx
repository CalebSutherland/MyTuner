import React, { useState, useRef, useEffect } from "react";
import StartTuning from "../StartTuning/StartTuning"
import Visual from "../Visual/Visual"
import NoteSelector from "../NoteSelector/NoteSelector";
import Stats from "../Stats/Stats";
import useAudioProcessor from "../../hooks/useAudioProcessor";
import './GeneralTuner.css';
import '../StartTuning/StartTuning.css';
import '../Visual/Visual.css';
import '../Stats/Stats.css';

function GeneralTuner() {
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

      <NoteSelector
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

export default GeneralTuner;