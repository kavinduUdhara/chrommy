// https://chatgpt.com/share/6748c1db-9360-800b-9a8c-de6bb222e552 my converstion with chatGPT

import { useState, useEffect } from "react";
import { checkEnv } from "../lib/utils";

export const useAiSession = () => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the session and environment
  const initializeSession = async () => {
    try {
      // Check if the environment supports the AI
      await checkEnv();

      // Create an AI session
      const newSession = await window.ai.languageModel.create();
      setSession(newSession);
      setIsReady(true);
    } catch (err) {
      console.error("Error initializing AI session:", err);
      setError(err.message || "Unknown error occurred.");
    }
  };

  // Handle a synchronous prompt
  const promptAI = async (prompt, onChunk) => {
    if (!session) {
      throw new Error("AI session is not initialized.");
    }
  
    try {
      // Use the streaming method to handle the prompt
      const stream = session.promptStreaming(prompt);
  
      // Process each chunk in the stream
      for await (const chunk of stream) {
        if (onChunk && typeof onChunk === "function") {
          onChunk(chunk); // Invoke the callback with the current chunk
        }
      }
    } catch (err) {
      console.error("Error during streaming prompt:", err);
      throw err;
    }
  };
  

  // Handle a streaming prompt
  const promptAIStreaming = async (prompt, onChunk) => {
    if (!session) {
      throw new Error("AI session is not initialized.");
    }
    try {
      const stream = session.promptStreaming(prompt);
      for await (const chunk of stream) {
        onChunk(chunk); // Call the callback for each streamed chunk
      }
    } catch (err) {
      console.error("Error during streaming prompt:", err);
      throw err;
    }
  };

  // Monitor download progress (optional)
  const monitorSession = () => {
    if (!session) return;
    session.addEventListener("downloadprogress", (e) => {
      console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
    });
  };

  // Effect to initialize the session on mount
  useEffect(() => {
    initializeSession();
    return () => {
      if (session) {
        session.close(); // Cleanup the session on unmount
      }
    };
  }, []);

  return {
    session,
    isReady,
    error,
    promptAI,
    promptAIStreaming,
    monitorSession,
  };
};
