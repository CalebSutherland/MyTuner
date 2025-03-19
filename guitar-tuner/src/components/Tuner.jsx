import { useState, useEffect, useRef } from "react";

const ALL_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const CONCERT_PITCH = 440; // A4 frequency

// Function to find the closest note based on detected frequency
const findClosestNote = (pitch) => {
  // Calculate the pitch index relative to the concert pitch (A4)
  const i = Math.round(Math.log2(pitch / CONCERT_PITCH) * 12);
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
    
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const filterRef = useRef(null);
    const dataArrayRef = useRef(null);
    const micStreamRef = useRef(null);

    const startListening = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const filter = audioContext.createBiquadFilter();
    
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(filter);
        source.connect(analyser);
    
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        filter.type = "bandpass";  // Use band-pass filter
        filter.frequency.setValueAtTime(440, audioContext.currentTime);  // Center frequency, can adjust to target pitch
        filter.Q.setValueAtTime(10, audioContext.currentTime);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        filterRef.current = filter;
        dataArrayRef.current = dataArray;
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
    
        // Clear refs
        micStreamRef.current = null;
        audioContextRef.current = null;
        analyserRef.current = null;
        dataArrayRef.current = null;
      };

      const detectPitch = () => {
        if (!analyserRef.current) return;
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
        const frequency = (maxIndex * sampleRate) / analyserRef.current.fftSize;

        const threshhold = -111;
        if (maxAmplitude > threshhold) {
          setFrequency(frequency.toFixed(2));

          // Find the closest note based on detected frequency
          const { note, frequency: closestPitch } = findClosestNote(frequency);
          setNote(note);

          // Set the tuning status (Sharp, Flat, In Tune)
          const diff = Math.abs(frequency - closestPitch);
          if (diff < 1) {
            setStatus("In Tune");
          } else if (frequency > closestPitch) {
            setStatus("Sharp");
          } else {
            setStatus("Flat");
          }
        } else {
          setFrequency(0);
          setNote(null);
          setStatus("");
        }
      };
    
      return (
        <div>
          <h1>Guitar Tuner</h1>
          <button className="tuning-button" onClick={isListening ? stopListening : startListening}>
            {isListening ? "Stop Tuning" : "Start Tuning"}
          </button>
          <p>Detected Frequency: {frequency} Hz</p>
          <p>Closest Note: {note}</p>
          <p>Status: {status}</p>
        </div>
      );
    }
    
    export default Tuner;