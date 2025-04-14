function Visual({ target, targetDiffernce, volume }) {
  const maxOffset = 25;
  const clampedValue = Math.max(-maxOffset, Math.min(targetDiffernce, maxOffset));
  const isAudioDetected = volume > 0;

  const diff = Math.abs(targetDiffernce);
  let lineColor = "white";

  if (!isAudioDetected || target === 0) {
    lineColor = "white";
  } else {
    // Normalize diff from 0 (perfect) to 20+ (very off)
    const clampedDiff = Math.min(diff, 20);

    let hue = 0;
    let lightness = 50;

    if (clampedDiff <= 5) {
      // Green to Yellow (120 → 60)
      const t = clampedDiff / 5;
      hue = 120 - t * 60;
    } else if (clampedDiff <= 10) {
      // Yellow to Red (60 → 0)
      const t = (clampedDiff - 5) / 5;
      hue = 60 - t * 60;
    } else {
      // Stay at red (hue = 0), darken from lightness 50 → 30
      hue = 0;
      const t = (clampedDiff - 10) / 10;
      lightness = 50 - t * 20; // goes from 50 → 30
    }

    lineColor = `hsl(${hue}, 100%, 50%)`;
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