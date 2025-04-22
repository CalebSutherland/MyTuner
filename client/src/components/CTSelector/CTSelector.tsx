import React, { useState, useEffect } from 'react';
import notes from "../../data/all_notes";
import "./CTSelector.css";

const noteNames = Object.keys(notes);

interface CustTuningButtonsProps {
  tuning: (string | null)[];
  onTuningChange: (tuning: (string | null)[]) => void;
}

function CustTuningButtons( { onTuningChange, tuning }:CustTuningButtonsProps) {
  const [activeGridIndex, setActiveGridIndex] = useState<number | null>(null);

  const handleButtonClick = (index: number) => {
    setActiveGridIndex(index === activeGridIndex ? null : index); // Toggle grid for the clicked button
  };

  const handleNoteSelect = (note: string) => {
    if (activeGridIndex === null) return;
    const updated = [...tuning];
    updated[activeGridIndex] = note;
    onTuningChange(updated);
    setActiveGridIndex(null);
  };

  return (
    <div className="multi-note-selector-wrapper">
      <div className="note-buttons">
      {tuning.map((note, i) => (
        <button
          key={i}
          className={`note-btn ${activeGridIndex === i ? "active" : ""}`}
          onClick={() => handleButtonClick(i)}
        >
          {note === null ? "--" : note}
        </button>
      ))}
      </div>

      {activeGridIndex !== null && (
        <div className="note-grid-container">
          <div className="note-grid">
            {noteNames.map(note => (
              <button key={note} className="note-grid-btn" onClick={() => handleNoteSelect(note)}>
                {note}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustTuningButtons;