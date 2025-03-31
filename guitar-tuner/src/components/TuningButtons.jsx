import Target from "./Target.jsx";

function TuningButtons({ tuning, target, changeTarget, detectedFreq }) {
  if (!tuning) {
    return null; // or return <div>No tuning selected</div>
  }

  return (
    <div>
      <p style={{ fontWeight: 500 }}>{tuning.name}</p>
      <div className="tuning-buttons-container">
        {tuning.notes.map((note, index) => (
          <Target 
            key={`${tuning.name}-${note}-${index}`}
            value={tuning.values[index]} 
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