import React, { useState } from "react";
import CustomTuner from "../components/CustomTuner/CustomTuner";
import { useTheme } from "../contexts/ThemeContext";

function CustomPage() {
  const { selectedTheme } = useTheme();
  const [customTuning, setCustomTuning] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [savedTunings, setSavedTunings] = useState<(string | null)[][]>([]);

  return (
    <CustomTuner
      selectedTheme={selectedTheme}
      customTuning={customTuning}
      setCustomTuning={setCustomTuning}
      savedTunings={savedTunings}
      setSavedTunings={setSavedTunings}
    />
  );
}

export default CustomPage;