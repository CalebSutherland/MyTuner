const freq = {
  "A1": 55.00,  "A#1": 58.27,  "B1": 61.74,  "C2": 65.41,
  "C#2": 69.30, "D2": 73.42,  "D#2": 77.78,  "E2": 82.41,
  "F2": 87.31,  "F#2": 92.50,  "G2": 98.00,  "G#2": 103.83,
  "A2": 110.00, "A#2": 116.54, "B2": 123.47, "C3": 130.81,
  "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81,
  "F3": 174.61, "F#3": 185.00, "G3": 196.00, "G#3": 207.65,
  "A3": 220.00, "A#3": 233.08, "B3": 246.94, "C4": 261.63,
  "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63,
  "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30,
  "A4": 440.00, "A#4": 466.16, "B4": 493.88,
};

const tunings = {
  "Standard": [
    { name: 'Standard', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'], values: [freq["E2"], freq["A2"], freq["D3"], freq["G3"], freq["B3"], freq["E4"], ] },
  ],
  "Power": [
    { name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["G3"], freq["B3"], freq["E4"], ] },
    { name: 'Double Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'D4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["G3"], freq["B3"], freq["D4"], ] },
    { name: 'D modal', notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["G3"], freq["A3"], freq["D4"], ] },
    { name: 'Double Daddy', notes: ['D2', 'A2', 'D3', 'D3', 'A3', 'D4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["D3"], freq["A3"], freq["D4"], ] },
    { name: 'Drop C♯', notes: ['C2♯', 'G2♯', 'C3♯', 'F3♯', 'A3♯', 'D4♯'], values: [freq["C#2"], freq["G#2"], freq["C#3"], freq["F#3"], freq["A#3"], freq["D#4"], ] },
    { name: 'Drop C', notes: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'], values: [freq["C2"], freq["G2"], freq["C3"], freq["F3"], freq["A3"], freq["D4"], ] },
    { name: 'Drop B', notes: ['B1', 'F2♯', 'B2', 'E3', 'G3♯', 'C4♯'], values: [freq["B1"], freq["F#2"], freq["B2"], freq["E3"], freq["G#3"], freq["C#4"], ] },
    { name: 'Drop A', notes: ['A1', 'E2', 'A2', 'D3', 'F3♯', 'B3'], values: [freq["A1"], freq["E2"], freq["A2"], freq["D3"], freq["F#3"], freq["B3"], ] },
  ],
  "Open": [
    { name: 'Open C', notes: ['C2', 'G2', 'C3', 'G3', 'C4', 'E4'], values: [freq["C2"], freq["G2"], freq["C3"], freq["G3"], freq["C4"], freq["E4"], ] },
    { name: 'Open E', notes: ['E2', 'B2', 'E3', 'G3♯', 'B3', 'E4'], values: [freq["E2"], freq["B2"], freq["E3"], freq["G#3"], freq["B3"], freq["E4"], ] },
    { name: 'Open F', notes: ['C2', 'F2', 'C3', 'F3', 'A3', 'F4'], values: [freq["C2"], freq["F2"], freq["C3"], freq["F3"], freq["A3"], freq["F4"], ] },
    { name: 'Open G', notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'], values: [freq["D2"], freq["G2"], freq["D3"], freq["G3"], freq["B3"], freq["D4"], ] },
    { name: 'Open A', notes: ['E2', 'A2', 'C3♯', 'E3', 'A3', 'E4'], values: [freq["E2"], freq["A2"], freq["C#3"], freq["E3"], freq["A3"], freq["E4"], ] },
    { name: 'Open A 2', notes: ['E2', 'A2', 'E3', 'A3', 'C4♯', 'E4'], values: [freq["E2"], freq["A2"], freq["E3"], freq["A3"], freq["C#4"], freq["E4"], ] },
    { name: 'Open Am', notes: ['E2', 'A2', 'E3', 'A3', 'C4', 'E4'], values: [freq["E2"], freq["A2"], freq["E3"], freq["A3"], freq["C4"], freq["E4"], ] },
    { name: 'Open Em', notes: ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'], values: [freq["E2"], freq["B2"], freq["E3"], freq["G3"], freq["B3"], freq["E4"], ] },
    { name: 'Open D', notes: ['D2', 'A2', 'D3', 'F3♯', 'A3', 'D4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["F#3"], freq["A3"], freq["D4"], ] },
    { name: 'Open Dm', notes: ['D2', 'A2', 'D3', 'F3', 'A3', 'D4'], values: [freq["D2"], freq["A2"], freq["D3"], freq["F3"], freq["A3"], freq["D4"], ] },
  ],
  "Extras": [
    { name: '-1', notes: ['D2♯', 'G2♯', 'C3♯', 'F3♯', 'A3♯', 'D4♯'], values: [freq["D#2"], freq["G#2"], freq["C#3"], freq["F#3"], freq["A#3"], freq["D#4"], ] },
    { name: '-2', notes: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'], values: [freq["D2"], freq["G2"], freq["C3"], freq["F3"], freq["A3"], freq["D4"], ] },
    { name: '+1', notes: ['F2', 'A2♯', 'D3♯', 'G3♯', 'C4', 'F4'], values: [freq["F2"], freq["A#2"], freq["D#3"], freq["G#3"], freq["C4"], freq["F4"], ] },
    { name: '+2', notes: ['F2♯', 'B2', 'E3', 'A3', 'C4♯', 'F4♯'], values: [freq["F#2"], freq["B2"], freq["E3"], freq["A3"], freq["C#4"], freq["F#4"], ] },
    { name: 'G modal', notes: ['D2', 'G2', 'D3', 'G3', 'C4', 'D4'], values: [freq["D2"], freq["G2"], freq["D3"], freq["G3"], freq["C4"], freq["D4"], ] },
    { name: 'All 4th', notes: ['E2', 'A2', 'D3', 'G3', 'C4', 'F4'], values: [freq["E2"], freq["A2"], freq["D3"], freq["G3"], freq["C4"], freq["F4"], ] },
    { name: 'NST', notes: ['C2', 'G2', 'D3', 'A3', 'E4', 'G4'], values: [freq["C2"], freq["G2"], freq["D3"], freq["A3"], freq["E4"], freq["G4"], ] },
  ]
}

export default tunings;