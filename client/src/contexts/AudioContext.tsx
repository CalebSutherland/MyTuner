import React, { createContext, useContext } from "react";
import useAudioProcessor from "../hooks/useAudioProcessor";

const AudioContext = createContext<ReturnType<typeof useAudioProcessor> | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audio = useAudioProcessor();
  return <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
};