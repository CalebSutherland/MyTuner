import { useState } from "react";
import Tuning from "./Tuning";

const tunings = [
  { name: "Standard", notes: ["E2", "A2", "D3", "G3", "B3", "E4"], values: [82.41, 110, 146.83, 196, 246.94, 329.63] },
  { name: "Drop D", notes: ["D2", "A2", "D3", "G3", "B3", "E4"], values: [73.42, 110, 146.83, 185, 220, 329.63] },
  { name: "Open D", notes: ["D2", "A2", "D3", "F#3", "A3", "D4"], values: [73.42, 110, 146.83, 196, 246.94, 293.66] },
  { name: "Drop C", notes: ["C2", "G2", "C3", "F3", "A3", "D4"], values: [65.41, 98, 130.81, 174.61, 220, 293.66] },
  { name: "Open G", notes: ["D2", "G2", "D3", "G3", "B3", "D4"], values: [73.42, 98, 146.83, 196, 246.94, 293.66] } 
]

function TuningList({ setTarget, detctedF, target }) {
  const [selectedTuning, setSelectedTuning] = useState(tunings[0]);

  return (
    <div>
      <label htmlFor="tuning-select">Select Tuning: </label>
      <select
        id="tuning-select"
        onChange={(e) => setSelectedTuning(tunings.find(t => t.name === e.target.value))}
      >
        {tunings.map(tuning => (
          <option key={tuning.name} value={tuning.name}>{tuning.name}</option>
        ))}
      </select>

      <Tuning
        key={selectedTuning.name} 
        name={selectedTuning.name} 
        notes={selectedTuning.notes} 
        values={selectedTuning.values} 
        changeTarget={setTarget}
        detectedFreq={detctedF}
        target={target}
      />
    </div>
  )
}

export default TuningList;