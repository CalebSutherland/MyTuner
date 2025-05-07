import React, { useRef, useState, useEffect } from 'react';
import { Metronome } from '../hooks/metronome';
import './MetronomePage.css';

const MetronomePage: React.FC = () => {
  const metronomeRef = useRef<Metronome | null>(null);
  const [bpm, setBpm] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);

  const toggleMetronome = () => {
    if (!metronomeRef.current) {
      metronomeRef.current = new Metronome(setCurrentBeat);
    }

    if (isRunning) {
      metronomeRef.current.stop();
    } else {
      metronomeRef.current.setTempo(bpm);
      metronomeRef.current.start();
    }

    setIsRunning(!isRunning);
  };

  useEffect(() => {
    return () => {
      metronomeRef.current?.stop();
    };
  }, []);

  return (
    <div className="metronome-container">
      <div className="metronome-dots">
        {[0, 1, 2, 3].map((beatIndex) => (
          <div
            key={beatIndex}
            className={`dot ${currentBeat === beatIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
      <label className="metronome-label">BPM: {bpm}</label>
      <input
        type="range"
        min={30}
        max={240}
        value={bpm}
        onChange={(e) => {
          const newBpm = parseInt(e.target.value);
          setBpm(newBpm);
          metronomeRef.current?.setTempo(newBpm);
        }}
        className="metronome-slider"
      />
      <button onClick={toggleMetronome} className="metronome-button">
        {isRunning ? 'Stop' : 'Start'} Metronome
      </button>
    </div>
  );
};

export default MetronomePage;