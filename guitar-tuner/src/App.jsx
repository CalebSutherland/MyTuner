import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [micStream, setMicStream] = useState(null);

  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);

  useEffect(() => {
    if (micStream && isListening) {
      // Set up Web Audio API
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(micStream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256; // Number of frequency bins (affects resolution)
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Function to update audio level
      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average); // Update state with average frequency data
        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } else {
      // Clean up when stopping listening
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [micStream, isListening]);


  const startListening = async () => {
    try {
      // Get the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setMicStream(stream);
      setIsListening(true);

      console.log("Microphone is active");
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopListening = () => {
    if (micStream) {
      micStream.getAudioTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    setIsListening(false);
    console.log("Microphone is stopped");
  };

  return (
    <div className="App">
      <h1>MyTuner</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <div
        style={{
        width: `${Math.min(audioLevel, 255)}px`,  // scale the width based on audio level
        height: '10px',
        backgroundColor: 'green',
        transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  )
}

export default App
