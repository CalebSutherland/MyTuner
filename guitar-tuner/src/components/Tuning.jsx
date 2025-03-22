import Target from "./Target.jsx";

function Tuning({ name, notes, values, changeTarget }) {
  return (
    <div>
      <p>{name}</p>
      <Target value={values[0]} note={notes[0]} updateTarget={changeTarget}/>
      <Target value={values[1]} note={notes[1]} updateTarget={changeTarget}/>
      <Target value={values[2]} note={notes[2]} updateTarget={changeTarget}/>
      <Target value={values[3]} note={notes[3]} updateTarget={changeTarget}/>
      <Target value={values[4]} note={notes[4]} updateTarget={changeTarget}/>
      <Target value={values[5]} note={notes[5]} updateTarget={changeTarget}/>
    </div>
  )
}

export default Tuning;