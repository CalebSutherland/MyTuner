
function Target({ note, value, updateTarget }) {
    return (
      <button className="tuning-button" onClick={() => updateTarget(value)}>
        {note} {value}
      </button>
    )
}

export default Target;