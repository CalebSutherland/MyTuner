function Visual({ target, targetDiffernce, volume }) {
  const maxOffset = 25;
  const clampedValue = Math.max(-maxOffset, Math.min(targetDiffernce, maxOffset));
  const isAudioDetected = volume > 0;

  return (
    <div className="container">
      <div
      className="line"
      style={{ transform: `translateX(${target === 0 ? 0 : clampedValue * 10}px)` }}
      >
        <span className="value-label">{target === 0 ? 0 : targetDiffernce}</span>
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