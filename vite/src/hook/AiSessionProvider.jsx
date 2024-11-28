// src/hook/AiSessionProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AiSessionContext = createContext(null);

// Custom Hook to use AI session
export const useAiSessionContextHook = () => {
  const context = useContext(AiSessionContext);
  if (!context) {
    throw new Error(
      "useAiSessionContextHook must be used within an AiSessionProvider"
    );
  }
  return context;
};

// Provider Component
export const AiSessionProvider = ({ children }) => {
  const [aiSession, setAiSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { available } = await window.ai.languageModel.capabilities();
        if (available !== "no") {
          const session = await window.ai.languageModel.create();
          setAiSession(session);
          setIsReady(true);
        }
      } catch (err) {
        setError(err.message);
        setIsReady(false);
      }
    };
    initializeSession();
  }, []);

  const promptAI = async (prompt) => {
    if (!aiSession) {
      throw new Error("AI session is not available.");
    }
    return await aiSession.prompt(prompt);
  };

  const promptAIStreaming = async (prompt) => {
    if (!aiSession) {
      throw new Error("AI session is not available.");
    }
    const stream = aiSession.promptStreaming(prompt);
    const result = [];
    for await (const chunk of stream) {
      result.push(chunk);
    }
    return result.join('');
  };

  return (
    <AiSessionContext.Provider value={{ aiSession, isReady, error, promptAI, promptAIStreaming }}>
      {children}
    </AiSessionContext.Provider>
  );
};
