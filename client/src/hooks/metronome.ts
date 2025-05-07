export class Metronome {
  private audioCtx: AudioContext;
  private nextNoteTime = 0;
  private tempo = 120;
  private isRunning = false;
  private intervalId: number | null = null;
  private currentBeat = 0;  // Track the current beat
  private setCurrentBeat: (beat: number | null) => void; // Update the beat in the component

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
      
      // Update the current beat, reset after the last beat (4)
      this.setCurrentBeat(this.currentBeat);
      setTimeout(() => {
        this.setCurrentBeat(null); // Reset beat after the flash
      }, 200); // Flash for 200ms

      // Increment beat and reset to 0 after 4 (since it's a 4-beat cycle)
      this.currentBeat = (this.currentBeat + 1) % 4;

      // Update the nextNoteTime based on the tempo
      this.nextNoteTime += 60.0 / this.tempo;
    }
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