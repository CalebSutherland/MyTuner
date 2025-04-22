import React, { useState, useRef } from "react";
import './ThemeSelector.css';

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (Math.max(0, R) << 16) +
      (Math.max(0, G) << 8) +
      Math.max(0, B)
    )
      .toString(16)
      .slice(1)
  );
}

function updateMainLight(hex: string) {
  const num = parseInt(hex.slice(1), 16);
  const R = (num >> 16) & 0xff;
  const G = (num >> 8) & 0xff;
  const B = num & 0xff;

  let brightCount = 0;
  if (R >= 225) brightCount++;
  if (G >= 225) brightCount++;
  if (B >= 225) brightCount++;

  let lightValue = "rgba(255, 255, 255, 0.1)";
  if (brightCount === 1) {
    lightValue = "rgba(255, 255, 255, 0.3)";
  } else if (brightCount >= 2) {
    lightValue = "rgba(255, 255, 255, 0.5)";
  }

  document.documentElement.style.setProperty("--main--light", lightValue);
}

function ThemeSelector() {
  const [customColors, setCustomColors] = useState<string[]>(["#700b0b", "#3502C0", "#B302C0"]);
  const [selectedColor, setSelectedColor] = useState("#00FFC8");
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null); // To track the active color box
  const colorPickerRef = useRef<HTMLInputElement | null>(null);

  const applyColor = (color: string) => {
    const hoverColor = darkenColor(color, 10);
    document.documentElement.style.setProperty("--main--color", color);
    document.documentElement.style.setProperty("--hover--color", hoverColor);
    updateMainLight(color);
  };

  const handleAddColor = () => {
    // Add a new color box with the current selected color
    setCustomColors((prevColors) => [...prevColors, selectedColor]);
    
    // Set the newly added color box as the active box
    setActiveColorIndex(customColors.length); // The new box will be at the last index
    
    // Open the color picker
    if (colorPickerRef.current) {
      colorPickerRef.current.click();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor); // Update the selected color as the user chooses

    // If there's an active box, update it with the new color
    if (activeColorIndex !== null) {
      const updatedColors = [...customColors];
      updatedColors[activeColorIndex] = newColor; // Update the active box color
      setCustomColors(updatedColors);
    }
  };

  const handleColorPickerClose = () => {
    // When the color picker is closed, update the color of the active box
    if (activeColorIndex !== null) {
      const updatedColors = [...customColors];
      updatedColors[activeColorIndex] = selectedColor; // Update the active box color
      setCustomColors(updatedColors);
    }

    // Apply the new color to the theme
    applyColor(selectedColor);
    setActiveColorIndex(null); // Reset the active color box after applying
  };

  return (
    <div className="color-swatches">
      <span>Colors:</span>
      {customColors.map((color, idx) => (
        <button
          key={idx}
          className="color-swatch"
          style={{ backgroundColor: color }}
          onClick={() => applyColor(color)}
        />
      ))}

      <button
        className="add-color-btn"
        onClick={handleAddColor}
        style={{ backgroundColor: selectedColor }}
      >
        +
      </button>

      {/* Hidden color picker */}
      <input
        ref={colorPickerRef}
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        onBlur={handleColorPickerClose} // When color picker is closed, finalize the box color
        className="color-picker-input"
        style={{ display: "none" }} // Hide the color picker input
      />
    </div>
  );
}

export default ThemeSelector;