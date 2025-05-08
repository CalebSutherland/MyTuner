import React, { useRef, useState, useEffect } from 'react';
import { Metronome } from '../hooks/metronome';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import './MetronomePage.css';

const MetronomePage: React.FC = () => {
  const metronomeRef = useRef<Metronome | null>(null);
  const [bpm, setBpm] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [noteValue, setNoteValue] = useState(4);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

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

  const handleTapTempo = () => {
    const now = Date.now();
    setTapTimes(prev => {
      // If last tap was over 2 seconds ago, reset the sequence
      if (prev.length > 0 && now - prev[prev.length - 1] > 2000) {
        return [now];
      }
  
      const newTaps = [...prev, now].slice(-5); // last 5 taps
  
      if (newTaps.length >= 2) {
        const intervals = newTaps.slice(1).map((t, i) => t - newTaps[i]);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        let newBpm = Math.round(60000 / avgInterval);
  
        // Clamp BPM between 30 and 240
        newBpm = Math.max(30, Math.min(240, newBpm));
  
        setBpm(newBpm);
        metronomeRef.current?.setTempo(newBpm);
      }
  
      return newTaps;
    });
  };

  useEffect(() => {
    return () => {
      metronomeRef.current?.stop();
    };
  }, []);

  return (
    <div className="metronome-container">
      <div className="time-sig">
        <p>Time signature</p>
        <select
          className="time-sig-select"
          value={`${beatsPerMeasure}/${noteValue}`}
          onChange={(e) => {
            const [beats, note] = e.target.value.split('/').map(Number);
            setBeatsPerMeasure(beats);
            setNoteValue(note);
            if (!metronomeRef.current) {
              metronomeRef.current = new Metronome(setCurrentBeat);
            }
            metronomeRef.current.setTimeSignature(beats, note);
          }}
        >
          <option value="1/4">1/4</option>
          <option value="2/4">2/4</option>
          <option value="3/4">3/4</option>
          <option value="4/4">4/4</option>
          <option value="5/4">5/4</option>
          <option value="7/4">7/4</option>
          <option value="5/8">5/8</option>
          <option value="6/8">6/8</option>
          <option value="7/8">7/8</option>
          <option value="9/8">9/8</option>
          <option value="12/8">12/8</option>
        </select>
      </div>
      <div className="metronome-dots">
        {Array.from({ length: beatsPerMeasure }, (_, beatIndex) => (
          <div
            key={beatIndex}
            className={`dot ${currentBeat === beatIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
      <div className="bpm-control">
        <span className="bpm-label">Beats per min</span>
        <div className="bpm-display">
          <button
            className="bpm-button"
            onClick={() => {
              const newBpm = Math.max(30, bpm - 1);
              setBpm(newBpm);
              metronomeRef.current?.setTempo(newBpm);
            }}
          >
            <CiCircleMinus />
          </button>
          <span className="bpm-number">{bpm}</span>
          <button
            className="bpm-button"
            onClick={() => {
              const newBpm = Math.min(240, bpm + 1);
              setBpm(newBpm);
              metronomeRef.current?.setTempo(newBpm);
            }}
          >
            <CiCirclePlus />
          </button>
        </div>
        <div>
          <button className="tap-tempo-button" onClick={handleTapTempo}>
            <TbHandClick />
          </button>
        </div>
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
      </div>
      <button onClick={toggleMetronome} className="metronome-button">
        {isRunning ? 'Stop' : 'Start'} Metronome
      </button>
    </div>
  );
};

export default MetronomePage;