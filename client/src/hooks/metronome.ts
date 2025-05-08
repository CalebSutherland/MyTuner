export class Metronome {
  private audioCtx: AudioContext;
  private nextNoteTime = 0;
  private tempo = 120;
  private isRunning = false;
  private intervalId: number | null = null;
  private currentBeat = 0;  // Track the current beat
  private setCurrentBeat: (beat: number | null) => void;
  private beatsPerMeasure = 4;
  private noteValue = 4;

  constructor(setCurrentBeat: (beat: number | null) => void) {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.setCurrentBeat = setCurrentBeat;
  }

  private scheduleClick(time: number) {
    const osc = this.audioCtx.createOscillator();
    const envelope = this.audioCtx.createGain();

    // Set different pitch for the first beat
    const frequency = this.currentBeat === 0 ? 1200 : 1000; // First beat (0) is higher

    osc.frequency.value = frequency;

    // Gentle attack and decay to avoid popping
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.3, time + 0.005); // attack
    envelope.gain.linearRampToValueAtTime(0, time + 0.05);    // decay

    osc.connect(envelope);
    envelope.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.06); // slight increase to avoid cutoff
  }

  private scheduler = () => {
    while (this.nextNoteTime < this.audioCtx.currentTime + 0.1) {
      this.scheduleClick(this.nextNoteTime);
  
      // Calculate duration until next note (e.g. eighth note spacing)
      const secondsPerBeat = (60.0 / this.tempo) * (4 / this.noteValue);
      const flashDuration = Math.max(secondsPerBeat * 1000 * 0.6, 50); // At least 50ms
  
      // Update the current beat
      this.setCurrentBeat(this.currentBeat);
      setTimeout(() => {
        this.setCurrentBeat(null); 
      }, flashDuration);
  
      // Increment beat and time
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
      this.nextNoteTime += secondsPerBeat;
    }
  };

  setTimeSignature(beats: number, noteValue: number) {
    this.beatsPerMeasure = beats;
    this.noteValue = noteValue;
  }

  start() {
    if (!this.isRunning) {
      this.audioCtx.resume(); // Ensure the audio context is active
      this.nextNoteTime = this.audioCtx.currentTime + 0.05;
      this.isRunning = true;
      this.currentBeat = 0;
      this.intervalId = window.setInterval(this.scheduler, 25);
    }
  }

  stop() {
    if (this.isRunning && this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.isRunning = false;
      this.intervalId = null;
    }
  }

  setTempo(bpm: number) {
    this.tempo = bpm;
  }
}