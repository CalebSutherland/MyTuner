import React from 'react';
import Tuning from './TuningButtons';
import TuningButtons from './TuningButtons';

function TuningList({ selectedTuning, setTarget, detctedF, target }) {

  return (
    <div>
      <TuningButtons
        key={selectedTuning.name}
        name={selectedTuning.name}
        notes={selectedTuning.notes}
        values={selectedTuning.values}
        changeTarget={setTarget}
        detectedFreq={detctedF}
        target={target}
      />
    </div>
  );
}

export default TuningList;