function Visual({ target, targetDiffernce }) {
  const maxOffset = 25;
  const clampedValue = Math.max(-maxOffset, Math.min(targetDiffernce, maxOffset));

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
    </div>
  );
}

export default Visual;