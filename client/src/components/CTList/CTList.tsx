import React from "react";
import './CTList.css';

interface CTListProps {
  savedTunings: (string | null)[][]
  loadTuning: (tuning: (string | null)[]) => void;
  deleteTuning: (index: number) => void;
}

function CTList({ savedTunings, loadTuning, deleteTuning }: CTListProps) {
  return(
    <div className="saved-tunings">
      <h3>Saved Tunings</h3>
      <ul>
        {savedTunings.map((tuning, index) => (
          <li key={index}>
            <button className="ct-button" onClick={() => loadTuning(tuning)}>
              {tuning.map(note => note ?? "--").join(" ")}
            </button>
            <button className="delete-btn" onClick={() => deleteTuning(index)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CTList