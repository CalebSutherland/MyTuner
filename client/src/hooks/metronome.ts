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
  private clickBuffer: AudioBuffer | null = null;

  constructor(setCurrentBeat: (beat: number | null) => void) {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.setCurrentBeat = setCurrentBeat;
    this.loadClickSound();
  }

  private async loadClickSound() {
    //Sound Effect by freesound_community from Pixabay
    const response = await fetch('assets/sounds/metronome-85688.mp3');
    const arrayBuffer = await response.arrayBuffer();
    this.clickBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
  }

  private scheduleClick(time: number) {
    if (!this.clickBuffer) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.clickBuffer;

    // Adjust playback rate slightly to raise pitch on first beat
    source.playbackRate.value = this.currentBeat === 0 ? 1.4 : 1.0;

    source.connect(this.audioCtx.destination);
    source.start(time);
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