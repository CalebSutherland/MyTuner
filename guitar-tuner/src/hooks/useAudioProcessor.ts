import { useState, useRef } from "react";

const ALL_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const CONCERT_PITCH = 440;

interface NoteInfo {
  note: string;
  frequency: string;
}

const findClosestNote = (pitch: number): NoteInfo => {
  if (pitch === 0) return { note: "No sound", frequency: "0" };

  const roundedPitch = parseFloat(pitch.toFixed(2));
  const i = Math.round(Math.log2(roundedPitch / CONCERT_PITCH) * 12);
  const validIndex = ((i % 12) + 12) % 12;
  const closestNote = ALL_NOTES[validIndex];
  const octave = 4 + Math.floor((i + 9) / 12);
  const closestPitch = CONCERT_PITCH * Math.pow(2, i / 12);
  return { note: `${closestNote}${octave}`, frequency: closestPitch.toFixed(2) };
};

interface AudioProcessorHook {
  frequency: number;
  note: string | null;
  status: string;
  isListening: boolean;
  volume: number;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

function useAudioProcessor() {
  const [frequency, setFrequency] = useState<number>(0);
  const [note, setNote] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeAnalyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);
  const volumeDataArrayRef = useRef<Uint8Array | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const volumeAnalyser = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    source.connect(volumeAnalyser);

    analyser.fftSize = 2048;
    volumeAnalyser.fftSize = 512;
    volumeAnalyser.minDecibels = -127;
    volumeAnalyser.maxDecibels = 0;
    volumeAnalyser.smoothingTimeConstant = 0.4;

    const volumeBufferLength = volumeAnalyser.frequencyBinCount;

    dataArrayRef.current = new Float32Array(analyser.fftSize);
    volumeDataArrayRef.current = new Uint8Array(volumeBufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    volumeAnalyserRef.current = volumeAnalyser;
    micStreamRef.current = stream;

    setIsListening(true);
    detectPitch();
  };

  const stopListening = () => {
    micStreamRef.current?.getAudioTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();

    setIsListening(false);
    setFrequency(0);
    setNote(null);
    setStatus("");
    setVolume(0);

    micStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
    volumeDataArrayRef.current = null;
  };

  const changeVolume = () => {
    const volumeAnalyser = volumeAnalyserRef.current;
    const volumeData = volumeDataArrayRef.current;
    if (!volumeAnalyser || !volumeData) return;

    volumeAnalyser.getByteFrequencyData(volumeData);
    let volumeSum = 0;
    for (const value of volumeData) volumeSum += value;
    const averageVolume = volumeSum / volumeData.length;
    setVolume(Math.round(averageVolume));
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    const volumeAnalyser = volumeAnalyserRef.current;
    const dataArray = dataArrayRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !volumeAnalyser || !dataArray || !audioContext) return;

    requestAnimationFrame(detectPitch);
    analyser.getFloatTimeDomainData(dataArray);
    const pitch = autoCorrelate(dataArray, audioContext.sampleRate);
  
    if (pitch !== -1) {
      changeVolume();
      const roundedPitch = parseFloat(pitch.toFixed(2));
      setFrequency(roundedPitch);
      const { note, frequency: closestPitch } = findClosestNote(pitch);
      setNote(note);
  
      const diff = Math.abs(pitch - parseFloat(closestPitch));
      if (diff < 1) {
        setStatus("");
      } else if (pitch > parseFloat(closestPitch)) {
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

  const autoCorrelate = (buf: Float32Array, sampleRate: number): number => {
    const SIZE = buf.length;
    const sensitivity = 0.01; // tweak this as needed
    let rms = 0;
  
    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < sensitivity) return -1;
  
    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }
  
    buf = buf.slice(r1, r2);
    const newSize = buf.length;
  
    const c = new Array(newSize).fill(0);
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize - i; j++) {
        c[i] += buf[j] * buf[j + i];
      }
    }
  
    let d = 0;
    while (c[d] > c[d + 1]) d++;
  
    let maxval = -1, maxpos = -1;
    for (let i = d; i < newSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
  
    let T0 = maxpos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
  
    return sampleRate / T0;
  };

  return {
    frequency,
    note,
    status,
    isListening,
    volume,
    startListening,
    stopListening,
  };
}

export default useAudioProcessor;