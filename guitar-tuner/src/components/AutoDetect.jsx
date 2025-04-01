import React from 'react';

function AutoDetect({ isAutoDetect, toggleAutoDetect }) {
  return (
    <div className="auto-detect-switch">
      <div
        className="switch-container"
        onClick={toggleAutoDetect} // Move onClick to switch-container
      >
        <div className={`switch-track ${isAutoDetect ? 'active' : ''}`}>
          <div className="switch-thumb"></div>
        </div>
      </div>
      <span className="switch-label">Auto Detect</span>
    </div>
  );
}

export default AutoDetect;