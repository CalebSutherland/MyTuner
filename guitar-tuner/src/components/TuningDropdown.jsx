import React from 'react';

function TuningDropdown({ tunings, selectedTuning, onTuningChange, selectedCategory, onCategoryChange }) {
  return (
    <div className="select-container"> {/* Add the wrapper div */}
      <div>
        <label htmlFor="category-select">Select Category: </label>
        <select
          id="category-select"
          className="custom-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {Object.keys(tunings).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tuning-select">Select Tuning: </label>
        <select
          id="tuning-select"
          className="custom-select"
          value={selectedTuning.name}
          onChange={(e) => onTuningChange(e.target.value)}
        >
          {tunings[selectedCategory].map((tuning) => (
            <option key={tuning.name} value={tuning.name}>
              {tuning.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TuningDropdown;