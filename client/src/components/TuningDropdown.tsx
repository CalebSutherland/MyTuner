import React from 'react';

interface Tuning {
  name: string;
}

interface TuningDropdownProps {
  tunings: { [category: string]: Tuning[] };
  selectedTuning: Tuning;
  onTuningChange: (tuningName: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const TuningDropdown: React.FC<TuningDropdownProps> = ({
  tunings,
  selectedTuning,
  onTuningChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="select-container">
      <div>
        <label htmlFor="category-select">Category: </label>
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
        <label htmlFor="tuning-select">Tuning: </label>
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