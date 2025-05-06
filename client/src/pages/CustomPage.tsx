import React, { useState, useEffect } from "react";
import CustomTuner from "../components/CustomTuner/CustomTuner";
import { useAuth } from "../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

function CustomPage() {
  const { user } = useAuth();
  const [customTuning, setCustomTuning] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [savedTunings, setSavedTunings] = useState<(string | null)[][]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!user?.username) return;

    const loadTunings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${user.username}/tunings`);
        if (!res.ok) throw new Error("Failed to fetch tunings");
        const data = await res.json();
        setSavedTunings(data.customTunings || []);
        setHasLoaded(true);
        console.log("custom tunings loaded");
      } catch (err) {
        console.error("Failed to load tunings:", err);
      }
    };

    loadTunings();
  }, [user]);

  useEffect(() => {
    if (!user?.username || !hasLoaded) return;

    const saveTunings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${user.username}/tunings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customTunings: savedTunings }),
        });

        if (!res.ok) {
          console.error("Failed to save tunings");
        }
        console.log("custom tunings saved");
      } catch (err) {
        console.error("Error saving tunings:", err);
      }
    };

    saveTunings();
  }, [savedTunings, hasLoaded, user]);

  return (
    <CustomTuner
      customTuning={customTuning}
      setCustomTuning={setCustomTuning}
      savedTunings={savedTunings}
      setSavedTunings={setSavedTunings}
    />
  );
}

export default CustomPage;