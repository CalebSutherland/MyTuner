import Target from "./Target.jsx";

function Tuning({ name, notes, values, target, changeTarget, detectedFreq }) {
  return (
    <div>
      <p>{name}</p>
      <div className="tuning-buttons-container">
        {notes.map((note, index) => (
          <Target 
            key={`${name}-${note}`}
            value={values[index]} 
            note={note} 
            target={target} 
            detectedFrequency={detectedFreq} 
            updateTarget={changeTarget}
          />
        ))}
      </div>
    </div>
  )
}

export default Tuning;