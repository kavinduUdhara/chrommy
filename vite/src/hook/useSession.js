// src/hook/useSession.js

import { checkEnv } from "../lib/utils";

export const createAiSession = async () => {
  try {
    // Check environment compatibility
    await checkEnv();

    // Create a new session
    const session = await window.ai.languageModel.create();
    return session;
  } catch (err) {
    throw new Error(err.message || "Unknown error occurred.");
  }
};

// Function to handle AI prompt
export const promptAI = async (session, prompt, onChunk) => {
  if (!session) {
    throw new Error("AI session is not initialized.");
  }

  try {
    const stream = session.promptStreaming(prompt);
    for await (const chunk of stream) {
      if (onChunk && typeof onChunk === "function") {
        onChunk(chunk);
      }
    }
  } catch (err) {
    console.error("Error during streaming prompt:", err);
    throw err;
  }
};
