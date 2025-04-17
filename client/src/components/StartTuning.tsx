import React from "react";

interface StartButtonProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ isListening, startListening, stopListening }) => {
  return (
    <button
      className={`start-button ${isListening ? 'listening' : ''}`}
      onClick={isListening ? stopListening : startListening}
    >
      {isListening ? 'Stop Tuning' : 'Start Tuning'}
    </button>
  );
};

export default StartButton;