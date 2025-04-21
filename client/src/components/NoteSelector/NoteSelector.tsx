import React, { useState, useEffect } from 'react';
import notes from "../../data/all_notes";
import './NoteSelector.css';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

interface NoteSelectorProps {
  setTarget: (frequency: number) => void;
  index: number;
  setIndex: (index: number) => void;
}

const noteNames = Object.keys(notes);

export default function NoteSelector({ setTarget, index, setIndex }: NoteSelectorProps) {
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const currentNote = noteNames[index];

  useEffect(() => {
    setTarget(notes[currentNote as keyof typeof notes]);
  }, [currentNote, setTarget]);

  const decrease = () => {
    if (index > 0) setIndex(index - 1);
  };

  const increase = () => {
    if (index < noteNames.length - 1) setIndex(index + 1);
  };

  const handleNoteClick = (note: string) => {
    setIndex(noteNames.indexOf(note));
    setShowGrid(false);
  };

  return (
    <div className="note-selector-wrapper">
      <div className="note-selector">
        <button onClick={decrease} disabled={index === 0} className="arrow-btn"><IoMdArrowDropleft /></button>
        <div className="note-label">{currentNote}</div>
        <button onClick={increase} disabled={index === noteNames.length - 1} className="arrow-btn"><IoMdArrowDropright /></button>
      </div>

      <div className="show-grid-btn-container">
        <button className="show-grid-btn" onClick={() => setShowGrid(!showGrid)}>
          {showGrid ? "Hide All Notes" : "Show All Notes"}
        </button>
      </div>

      {showGrid && (
        <div className="note-grid-container">
          <div className="note-grid">
            {noteNames.map(note => (
              <button key={note} className="note-grid-btn" onClick={() => handleNoteClick(note)}>
                {note}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}