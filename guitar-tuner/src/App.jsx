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
        if (!isListening) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average); // Update state with average frequency data
        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        analyserRef.current = null;
        audioContextRef.current = null;
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
    setAudioLevel(0);
    console.log("Microphone is stopped");
  };

  return (
    <div className="App">
      <h1>MyTuner</h1>
      <button className="tuning-button" onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <p>Audio Level: {audioLevel.toFixed(0)}</p>
    </div>
  )
}

export default App
