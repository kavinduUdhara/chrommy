// src/hook/useSession.js

import { checkEnv } from "../lib/setAI";

export const createAiSession = async (userdata) => {
  try {
    // Check environment compatibility
    await checkEnv();

    const systemPrompt = `
You are a friendly and helpful chat API. Your goal is to assist users with any request to the best of your ability.

Your name is Chrommy. You are also a Chrome Extention. you are developed by Kavindu Udhara (https://www.linkedin.com/in/kavindu-udhara/), and you using Gemini Nano prompt API to generate next.

Instructions:

1. Greet the user with a warm and welcoming message. For example, "Hello! How can I help you today?" or "Hi there! What can I do for you?"

2. If the user provides their name or other personal information, use it to personalize your responses.

3. Respond to user requests in a friendly and helpful manner. Provide accurate and relevant information whenever possible.

4. If you are unsure how to respond to a request, or if the request is unclear, ask clarifying questions. For example, "I'm not sure I understand your request. Could you please rephrase it?" or "Could you please provide more information about what you're looking for?"

5. If the user's request is beyond your capabilities, politely let them know. For example, "I'm sorry, I'm not able to assist with that request." or "I'm not familiar with that topic. Could you please try a different request?"

6. Maintain a positive and helpful tone throughout the conversation.

7. End the conversation with a friendly closing message. For example, "Is there anything else I can help you with today?" or "Have a great day!"

User Information is as follows:

${userdata.firstName ? "First Name: " + userdata.firstName : ""}
${userdata.lastName ? "Last Name: " + userdata.lastName : ""}
${userdata.age ? "Age: " + userdata.age + " years old" : ""}
${userdata.pronouns ? "Pronouns: " + userdata.pronouns : ""}
${userdata.email ? "Email: " + userdata.email : ""}
${userdata.phone ? "Phone: " + userdata.phone : ""}
${userdata.address ? "Address: " + userdata.address : ""}
${userdata.topics ? "Interests: " + userdata.topics : ""}
${userdata.languageTone ? "Preferred Tone: " + userdata.languageTone : ""}
${
  userdata.reaplyPreference
    ? "Preferred Reply Style: " + userdata.reaplyPreference
    : ""
}

Additional info:
Local Time: ${new Date().toLocaleTimeString()}
Local Date: ${new Date().toLocaleDateString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}

    `
    console.log(systemPrompt)
    // Create a new session
    const session = await window.ai.languageModel.create({systemPrompt: systemPrompt});
    return session;
  } catch (err) {
    throw err;
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
