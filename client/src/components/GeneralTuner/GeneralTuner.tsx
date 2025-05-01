import React, { useState, useRef, useEffect } from "react";
import { useAudio } from "../../contexts/AudioContext";
import StartTuning from "../StartTuning/StartTuning";
import Visual from "../Visual/Visual";
import AutoDetect from "../AutoDetect/AutoDetect";
import NoteSelector from "../NoteSelector/NoteSelector";
import Stats from "../Stats/Stats";
import notes from "../../data/all_notes";
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
  } = useAudio();

  const [target, setTarget] = useState<number>(0);
  const [isAutoDetect, setIsAutoDetect] = useState<boolean>(false);
  const noteNames = Object.keys(notes);
  const [noteIndex, setNoteIndex] = useState<number>(noteNames.indexOf("E2"));
  const stableNoteRef = useRef<string | null>(null);
  const noteChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggleAutoDetect() {
    setIsAutoDetect(!isAutoDetect);
  }

  useEffect(() => {
    if (isAutoDetect && note) {
      if (note !== stableNoteRef.current) {
        stableNoteRef.current = note;
  
        // Clear previous timeout
        if (noteChangeTimeoutRef.current) {
          clearTimeout(noteChangeTimeoutRef.current);
        }
  
        // Set new timeout to update after delay
        noteChangeTimeoutRef.current = setTimeout(() => {
          const detectedIndex = noteNames.indexOf(note);
          if (detectedIndex !== -1) {
            setNoteIndex(detectedIndex);
          }
        }, 500); // adjust delay here (milliseconds)
      }
    }
  }, [note, isAutoDetect]);

  useEffect(() => {
    return () => {
      if (noteChangeTimeoutRef.current) {
        clearTimeout(noteChangeTimeoutRef.current);
      }
    };
  }, []);

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

      <div className="auto-detect-container">
        <AutoDetect 
          isAutoDetect={isAutoDetect} 
          toggleAutoDetect={toggleAutoDetect} 
        />
      </div>

      <NoteSelector
        setTarget={setTarget}
        index={noteIndex}
        setIndex={setNoteIndex}
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