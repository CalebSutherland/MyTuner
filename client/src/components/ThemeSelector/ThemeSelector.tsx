import React, { useState} from "react";
import './ThemeSelector.css'

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

  // Count how many components are 240 or higher
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
  //const [themeColor, setThemeColor] = useState("#700b0b");
  const [customColors, setCustomColors] = useState<string[]>(["#700b0b", "#3502C0", "#B302C0"]);
  const [selectedColor, setSelectedColor] = useState("#FF0000");

  const applyColor = (color: string) => {
    //setThemeColor(color);
    const hoverColor = darkenColor(color, 10);
    document.documentElement.style.setProperty("--main--color", color);
    document.documentElement.style.setProperty("--hover--color", hoverColor);
    updateMainLight(color);
  };

  const handleAddColor = () => {
    if (!customColors.includes(selectedColor)) {
      setCustomColors([...customColors, selectedColor]);
      applyColor(selectedColor);
    }
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

      <input
        type="color"
        id="colorPicker"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="color-picker-input"
      />
    </div>
  )
}

export default ThemeSelector