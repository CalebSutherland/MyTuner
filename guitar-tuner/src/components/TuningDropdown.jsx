import React from 'react';

const TuningDropdown = ({ tunings, selectedTuning, onTuningChange }) => {
    return (
      <div>
        <label htmlFor="tuning-select">Select Tuning: </label>
        <select
          id="tuning-select"
          value={selectedTuning.name}
          onChange={(e) => onTuningChange(e.target.value)}
        >
          {tunings.map((tuning) => (
            <option key={tuning.name} value={tuning.name}>
              {tuning.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default TuningDropdown;