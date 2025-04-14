import React from "react";

type StatsProps = {
  frequency: number;
  note: string | null;
  status: string;
  volume: number;
  target: number;
};

function Stats({ frequency, note, status, volume, target }: StatsProps) {
  return (
    <div className="stats-container">
      <h3 className="stats-title">Tuning Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Frequency:</span>
          <span className="stat-value">{frequency} Hz</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Closest Note:</span>
          <span className="stat-value">{note} {status}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Target:</span>
          <span className="stat-value">{target}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Target Difference:</span>
          <span className="stat-value">
            {frequency - target < 0 ? "-" : "+"} 
            {frequency === 0 || target === 0 ? 0 : Math.abs(frequency - target).toFixed(0)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Volume:</span>
          <span className="stat-value">{volume}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label"></span>
          <span className="stat-value"></span>
        </div>
      </div>
    </div>
  )
}

export default Stats;