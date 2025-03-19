import { useState, useRef } from "react";

function Tuner() {
    const [frequency, setFrequency] = useState(0);
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

        const threshhold = -50;
        if (maxAmplitude > threshhold) {
          setFrequency(frequency.toFixed(2));
        } else {
          setFrequency(0);
        }
      };
    
      return (
        <div>
          <h1>Guitar Tuner</h1>
          <button className="tuning-button" onClick={isListening ? stopListening : startListening}>
            {isListening ? "Stop Tuning" : "Start Tuning"}
          </button>
          <p>Detected Frequency: {frequency} Hz</p>
        </div>
      );
    }
    
    export default Tuner;