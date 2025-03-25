import Target from "./Target.jsx";

function Tuning({ name, notes, values, target, changeTarget, detectedFreq }) {
  return (
    <div>
      <p>{name}</p>
      <Target key={`${name}-${notes[0]}`} value={values[0]} note={notes[0]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
      <Target key={`${name}-${notes[1]}`} value={values[1]} note={notes[1]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
      <Target key={`${name}-${notes[2]}`} value={values[2]} note={notes[2]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
      <Target key={`${name}-${notes[3]}`} value={values[3]} note={notes[3]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
      <Target key={`${name}-${notes[4]}`} value={values[4]} note={notes[4]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
      <Target key={`${name}-${notes[5]}`} value={values[5]} note={notes[5]} target={target} detectedFrequency={detectedFreq} updateTarget={changeTarget}/>
    </div>
  )
}

export default Tuning;