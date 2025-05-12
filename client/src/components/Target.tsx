import React from 'react';
import { useState, useEffect, useRef } from "react";

interface TargetProps {
  note: string;
  value: number;
  updateTarget: (value: number) => void;
  detectedFrequency: number;
  target: number;
  playSound: (note: string) => void;
}

function Target({ note, value, updateTarget, detectedFrequency, target, playSound }: TargetProps) {
  const [tuningStatus, setTuningStatus] = useState<string>("out");
  const inRangeSinceRef = useRef<number | null>(null);
  const lastDesiredStatusRef = useRef<string | null>(null);

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
      title="Press to set target note"
      onClick={() => {
        updateTarget(value);
        playSound(note);
      }}
    >
      {note}
    </button>
  );
}

export default Target;