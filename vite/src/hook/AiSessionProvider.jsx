import React, { createContext, useContext } from "react";
import { useAiSession } from "./useSession";

// Create Context
const AiSessionContext = createContext(null);

// Provider Component
export const AiSessionProvider = ({ children }) => {
  const { isReady, error, ...aiSession } = useAiSession();

  if (error) {
    return (
      <div>
        <p>Error initializing AI session:</p>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!isReady) {
    return <div>Loading AI session...</div>; // Or a more polished loading UI
  }

  return (
    <AiSessionContext.Provider value={aiSession}>
      {children}
    </AiSessionContext.Provider>
  );
};

// Custom Hook to use AI session
export const useAiSessionContext = () => {
  const context = useContext(AiSessionContext);
  if (!context) {
    throw new Error(
      "useAiSessionContext must be used within an AiSessionProvider"
    );
  }
  return context;
};
