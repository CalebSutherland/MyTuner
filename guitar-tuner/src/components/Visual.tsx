import React from "react";

interface VisualProps {
  target: number;
  targetDiffernce: number;
  volume: number;
}

const Visual: React.FC<VisualProps> = ({ target, targetDiffernce, volume }) => {
  const maxOffset = 25;
  const clampedValue = Math.max(-maxOffset, Math.min(targetDiffernce, maxOffset));
  const isAudioDetected = volume > 0;

  let lineColor = "white";

  if (!isAudioDetected || target === 0) {
    lineColor = "white";
  } else {
    const diff = Math.abs(targetDiffernce);
  
    if (diff <= 3) {
      // Green → Yellow (0–3)
      const t = diff / 3;  // Normalize from 0 → 1
      const r = Math.round(t * 255);  // 0 → 255
      const g = 255;
      const b = 0;
      lineColor = `rgb(${r}, ${g}, ${b})`;
    } else if (diff <= 10) {
      // Yellow → Yellow-Yellow-Orange (3–10)
      const t = (diff - 3) / 7;  // Normalize from 0 → 1
      const r = 255;
      const g = Math.round(255 - t * 100);  // 255 → 155
      const b = 0;
      lineColor = `rgb(${r}, ${g}, ${b})`;
    } else if (diff <= 15) {
      // Yellow → Yellow-Orange (10–15)
      const t = (diff - 10) / 5;  // Normalize from 0 → 1
      const r = 255;
      const g = Math.round(155 - t * 70);  // 155 → 85
      const b = 0;
      lineColor = `rgb(${r}, ${g}, ${b})`;
    } else if (diff <= 20) {
      // Orange → Red (15–20)
      const t = (diff - 15) / 5;  // Normalize from 0 → 1
      const r = 255;
      const g = Math.round(85 - t * 85);  // 85 → 0
      const b = 0;
      lineColor = `rgb(${r}, ${g}, ${b})`;
    } else if (diff <= 40) {
      // Red → Dark Red (20–40)
      const t = (diff - 20) / 20;  // Normalize 0 → 1
      const r = Math.round(255 - t * (255 - 90));  // 255 → 90
      const g = 0;
      const b = 0;
      lineColor = `rgb(${r}, ${g}, ${b})`;
    } else {
      lineColor = "rgb(90, 0, 0)"; // Darkest red past 40
    }
  }

  return (
    <div className="container">
      <div
        className="line"
        style={{ 
          transform: `translateX(${target === 0 ? 0 : clampedValue * 10}px)`,
          backgroundColor: lineColor,
        }}
      >
        <span 
          className="value-label"
          style={{color: lineColor}}
        >
          {target === 0 ? 0 : targetDiffernce}
        </span>
      </div>
      <div className="flat-icon">♭</div>
      <div className="sharp-icon">♯</div>
      <div className="recording-icon" 
        style={{ opacity: isAudioDetected ? 1 : 0.2, animation: isAudioDetected ? 'glow 1s infinite alternate' : 'none' }}>
      </div>
    </div>
  );
}

export default Visual;