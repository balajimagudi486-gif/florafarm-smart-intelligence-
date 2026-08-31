// FloraFarm — Global Chat Context
// Stores the active scan results so the floating ChatWidget can inject them
// as conversation context regardless of which page the user is on.
import React, { createContext, useCallback, useContext, useState } from 'react';
import type { DiseaseResult, FertilizerResult } from '../types';

interface ChatContextValue {
  diseaseResult: DiseaseResult | null;
  fertilizerResult: FertilizerResult | null;
  /** Call after a disease scan completes */
  setDiseaseResult: (r: DiseaseResult | null) => void;
  /** Call after a fertilizer recommendation completes */
  setFertilizerResult: (r: FertilizerResult | null) => void;
  /** Reset both — e.g. when user starts a new analysis */
  clearChatContext: () => void;
}

const ChatContext = createContext<ChatContextValue>({
  diseaseResult: null,
  fertilizerResult: null,
  setDiseaseResult: () => {},
  setFertilizerResult: () => {},
  clearChatContext: () => {},
});

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diseaseResult, setDiseaseResultState] = useState<DiseaseResult | null>(null);
  const [fertilizerResult, setFertilizerResultState] = useState<FertilizerResult | null>(null);

  const setDiseaseResult = useCallback((r: DiseaseResult | null) => {
    setDiseaseResultState(r);
  }, []);

  const setFertilizerResult = useCallback((r: FertilizerResult | null) => {
    setFertilizerResultState(r);
  }, []);

  const clearChatContext = useCallback(() => {
    setDiseaseResultState(null);
    setFertilizerResultState(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{ diseaseResult, fertilizerResult, setDiseaseResult, setFertilizerResult, clearChatContext }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/** Hook for pages to push scan results into the global chat context */
export const useChatContext = () => useContext(ChatContext);
