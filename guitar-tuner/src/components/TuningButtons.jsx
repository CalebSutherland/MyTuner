import Target from "./Target.jsx";

function TuningButtons({ name, notes, values, target, changeTarget, detectedFreq }) {
  return (
    <div>
      <p style={{ fontWeight: 500 }}>{name}</p>
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

export default TuningButtons;