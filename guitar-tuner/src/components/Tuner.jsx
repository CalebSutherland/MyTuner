import { useState, useRef, useEffect } from "react";
import TuningButtons from "./TuningButtons.jsx";
import Visual from "./Visual"
import Stats from "./Stats.jsx";
import TuningDropdown from "./TuningDropdown.jsx";
import AutoDetect from './AutoDetect.jsx';
import tunings from "../data/all_tunings.js"

const ALL_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const CONCERT_PITCH = 440; // A4 frequency

// Function to find the closest note based on detected frequency
const findClosestNote = (pitch) => {
  if (pitch === 0) return { note: "No sound", frequency: "0" };

  const roundedPitch = parseFloat(pitch.toFixed(2));

  // Calculate the pitch index relative to the concert pitch (A4)
  const i = Math.round(Math.log2(roundedPitch / CONCERT_PITCH) * 12);
  const validIndex = ((i % 12) + 12) % 12;
  const closestNote = ALL_NOTES[validIndex];
  const octave = 4 + Math.floor((i + 9) / 12); // Calculate octave
  const closestPitch = CONCERT_PITCH * Math.pow(2, i / 12); // Closest pitch in Hz
  return { note: `${closestNote}${octave}`, frequency: closestPitch.toFixed(2) };
};

function Tuner() {
  const [frequency, setFrequency] = useState(0);
  const [note, setNote] = useState(null);
  const [status, setStatus] = useState(""); // Status text (In Tune, Flat, Sharp)
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [target, setTarget] = useState(0);
  const [selectedTuning, setSelectedTuning] = useState(tunings["Standard"][0]);
  const [selectedCategory, setSelectedCategory] = useState("Standard");
  const [isAutoDetect, setIsAutoDetect] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const volumeAnalyserRef = useRef(null);
  const filterRef = useRef(null);
  const dataArrayRef = useRef(null);
  const volumeDataArrayRef = useRef(null);
  const micStreamRef = useRef(null);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const volumeAnalyser = audioContext.createAnalyser();
    const filter = audioContext.createBiquadFilter();

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(filter);
    source.connect(analyser);
    source.connect(volumeAnalyser);
    
    analyser.fftSize = 16384;
    volumeAnalyser.fftSize = 512;
    volumeAnalyser.minDecibels = -127;
    volumeAnalyser.maxDecibels = 0;
    volumeAnalyser.smoothingTimeConstant = 0.4;

    const bufferLength = analyser.frequencyBinCount;
    const volumeBufferLength = volumeAnalyser.frequencyBinCount;

    dataArrayRef.current = new Float32Array(bufferLength);
    volumeDataArrayRef.current = new Uint8Array(volumeBufferLength);

    filter.type = "bandpass";  // Use band-pass filter
    filter.frequency.setValueAtTime(196, audioContext.currentTime);  // Center frequency, can adjust to target pitch
    filter.Q.setValueAtTime(10, audioContext.currentTime);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    volumeAnalyserRef.current = volumeAnalyser;
    filterRef.current = filter;
    micStreamRef.current = stream;

    setIsListening(true);
    detectPitch();
  };

  const stopListening = () => {
    // Stop the microphone input
    micStreamRef.current?.getAudioTracks().forEach(track => track.stop());
    // Close the AudioContext
    audioContextRef.current?.close();

    // Reset frequency display
    setIsListening(false);
    setFrequency(0);
    setNote(null);
    setStatus("");
    setVolume(0);
    setTarget(0);

    // Clear refs
    micStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  const changeVolume = () => {
    volumeAnalyserRef.current.getByteFrequencyData(volumeDataArrayRef.current);
    let volumeSum = 0;
    for (const volume of volumeDataArrayRef.current)
      volumeSum += volume;
    const averageVolume = volumeSum / volumeDataArrayRef.current.length;
    setVolume(averageVolume.toFixed(0));
  }

  // Quadratic Interpolation for better accuracy
  const interpolatePeak = (index) => {
    if (index <= 0 || index >= dataArrayRef.current.length - 1) return index;
    let alpha = dataArrayRef.current[index - 1];
    let beta = dataArrayRef.current[index];
    let gamma = dataArrayRef.current[index + 1];
    let peakIndex = index + 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
    return peakIndex;
  };

  const detectPitch = () => {
    if (!analyserRef.current || !volumeAnalyserRef.current) return;
    requestAnimationFrame(detectPitch);

    analyserRef.current.getFloatFrequencyData(dataArrayRef.current);

    let maxIndex = 0;
    let maxAmplitude = -Infinity;

    dataArrayRef.current.forEach((value, index) => {
      if (value > maxAmplitude) {
        maxAmplitude = value;
        maxIndex = index;
      }
    });
    
    const sampleRate = audioContextRef.current.sampleRate;
    const interpolatedIndex = interpolatePeak(maxIndex);
    let detectedFreq = (interpolatedIndex * sampleRate) / analyserRef.current.fftSize;

    let halfIndex = Math.round(maxIndex / 2);
    let halfFreq = (halfIndex * sampleRate) / analyserRef.current.fftSize;
    let halfAmplitude = dataArrayRef.current[halfIndex];

    if (halfAmplitude > maxAmplitude - 20) {  
      detectedFreq = halfFreq;
    }

    const threshhold = -70;
    if (maxAmplitude > threshhold) {
      changeVolume();
      setFrequency(detectedFreq.toFixed(2));
      const { note, frequency: closestPitch } = findClosestNote(detectedFreq);
      setNote(note);

      const diff = Math.abs(detectedFreq - closestPitch);
      if (diff < 1) {
        setStatus("");
      } else if (detectedFreq > closestPitch) {
        setStatus("♯");
      } else {
        setStatus("♭");
      }

    } else {
      setFrequency(0);
      setNote(null);
      setStatus("");
      setVolume(0);
    }
  };

  const handleTuningChange = (tuningName) => {
    const selectedTuningObject = tunings[selectedCategory].find(
      (t) => t.name === tuningName
    );
    setSelectedTuning(selectedTuningObject); // or setSelectedTuning(selectedTuningObject) if you want the object
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (tunings[category] && tunings[category].length > 0) {
      setSelectedTuning(tunings[category][0]); // Update with the tuning *object*
    } else {
      setSelectedTuning(null); // or set to default if no tunings in category
    }
  };

  const toggleAutoDetect = () => {
    setIsAutoDetect(!isAutoDetect);
  };

  const detectClosestNote = (freq) => {
    if (!selectedTuning) return 0;

    let closestNote = selectedTuning.values[0];
    let minDiff = Math.abs(freq - selectedTuning.values[0]);

    selectedTuning.values.forEach((val) => {
      const diff = Math.abs(freq - val);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = val;
      }
    });

    return closestNote;
  };

  useEffect(() => {
    if (isAutoDetect && frequency > 0) {
      const closestTarget = detectClosestNote(frequency);
      setTarget(closestTarget);
    }
  }, [isAutoDetect, frequency, selectedTuning]);
  
  return (
    <>
      <TuningDropdown
        tunings={tunings}
        selectedTuning={selectedTuning}
        onTuningChange={handleTuningChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <button 
        className={`start-button ${isListening ? "listening" : ""}`} 
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? "Stop Tuning" : "Start Tuning"}
      </button>

      <Visual 
        target={target} 
        targetDiffernce={frequency === 0 ? 0 : (frequency - target).toFixed(0)}
        volume={volume}
      />

      <AutoDetect 
        isAutoDetect={isAutoDetect} 
        toggleAutoDetect={toggleAutoDetect} 
      />

      <TuningButtons
        tuning={selectedTuning}
        changeTarget={setTarget}
        detectedFreq={frequency}
        target={target}
      />

      <Stats 
        frequency={frequency} 
        note={note} 
        status={status} 
        volume={volume} 
        target={target}
      />
    </>
  );
}
    
export default Tuner;