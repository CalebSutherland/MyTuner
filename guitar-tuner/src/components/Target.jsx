
function Target({ value, updateTarget }) {
    return (
      <button className="tuning-button" onClick={() => updateTarget(value)}>
        {value}
      </button>
    )
}

export default Target;