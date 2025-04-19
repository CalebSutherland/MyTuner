import React from 'react';
import { useState, useEffect, useRef } from "react";

interface TargetProps {
  note: string;
  value: number;
  updateTarget: (value: number) => void;
  detectedFrequency: number;
  target: number;
  playSound: (
    note: string, audioRefs: React.RefObject<Record<string, HTMLAudioElement>>,
    getAudioUrl: (note: string) => Promise<null | string>
  ) => void;
}

function Target({ note, value, updateTarget, detectedFrequency, target, playSound }: TargetProps) {
  const [tuningStatus, setTuningStatus] = useState<string>("out");
  const inRangeSinceRef = useRef<number | null>(null);
  const lastDesiredStatusRef = useRef<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({}); // Initialize as an empty object

  const audioFiles = import.meta.glob('../data/guitar_sounds/*.mp3', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;

  const getAudioUrl = async (note: string): Promise<null | string> => {
    const translatedNote = note.replace('♯', 'S');
    const audioFileKey = `../data/guitar_sounds/${translatedNote}.mp3`;

    if (audioFiles[audioFileKey]) {
      const audioModule = await audioFiles[audioFileKey]();
      return audioModule; // Return the URL of the audio file
    }
    console.warn("Missing audio file:", audioFileKey);
    return null;
  };

  useEffect(() => {
      if (value !== target) return;
    
      const diff = Math.abs(detectedFrequency - value);
      const now = Date.now();

      let desiredStatus = "out";
      if (diff <= 1) {
        desiredStatus = "in";
      } else if (diff <= 5) {
        desiredStatus = "close";
      }

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
        updateTarget(value);
        playSound(note, audioRefs, getAudioUrl);
      }}
    >
      {note}
    </button>
  );
}

export default Target;