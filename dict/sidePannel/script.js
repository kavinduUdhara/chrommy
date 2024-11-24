document.addEventListener("DOMContentLoaded", () => {
  // Query for the currently active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const domain = url.hostname; // Extracts "about.google" from the URL
      document.getElementById("tab-url").textContent = `${domain}`;
      document.getElementById("tab-title").textContent = `${tab.title}`;
      chrome.tabs.sendMessage(tab.id, { action: "getFavicon" }, (response) => {
        const faviconUrl = response?.favicon;
        if (faviconUrl) {
          const faviconElement = document.getElementById("fav-icon");
          faviconElement.src = faviconUrl; // Set the img `src` attribute
          faviconElement.alt = `Favicon of ${domain}`;
          checkFaviconBrightness(faviconUrl);
        }
      });
    } else {
      document.getElementById("tab-url").textContent = "URL: Not available";
      document.getElementById("tab-title").textContent = "Title: Not available";
    }
  });
});

function checkFaviconBrightness(faviconUrl) {
  const img = new Image();
  img.src = faviconUrl;

  img.onload = function () {
    const faviconElement = document.getElementById("fav-icon");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = imageData.data;
    let whitePixelCount = 0;
    const totalPixels = pixels.length / 4; // Total number of pixels

    // Loop through all the pixels and count how many are close to white
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]; // Red
      const g = pixels[i + 1]; // Green
      const b = pixels[i + 2]; // Blue

      // Check if the pixel is close to white (all RGB values are close to 255)
      if (r > 200 && g > 200 && b > 200) {
        whitePixelCount++;
      }
    }

    // Calculate the percentage of white pixels
    const whitePercentage = (whitePixelCount / totalPixels) * 100;
    console.log("White color percentage:", whitePercentage);

    // If more than 60% of the pixels are white, add the 'dark' class
    if (whitePercentage > 51) {
      faviconElement.classList.add("dark");
    } else {
      faviconElement.classList.remove("dark");
    }
  };

  // If the image fails to load, handle that as well (fallback)
  img.onerror = function () {
    const faviconElement = document.getElementById("fav-icon");
    faviconElement.classList.remove("dark"); // Remove dark class if favicon fails to load
  };
}

document.addEventListener("input", (event) => {
  const textarea = event.target;
  if (textarea.id === "chat-input") {
    const parent = textarea.closest(".chat-box-send");

    // Reset height to auto to calculate new height
    textarea.style.height = "auto";

    // Set height to the scroll height or max height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`; // Adjust 160px to your `max-h-40` in Tailwind

    // Add 'multiline' class to parent if textarea height exceeds 40px
    if (textarea.scrollHeight > 40) {
      parent.classList.add("multiline");
    } else {
      parent.classList.remove("multiline");
    }
  }
});


let session; // Persist session across prompts

async function initializeSession() {
  if (!session) {
    session = await ai.languageModel.create({
      systemPrompt: "You are a friendly and knowledgeable assistant ready to help with any topic. You can answer questions, provide explanations, offer recommendations, and engage in meaningful conversations about various subjects. Be approachable, insightful, and conversational, adapting your responses to suit the user's needs. take responces in a conversational tone.",
    });
  }
}

async function handleSendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  const mainHolder = document.querySelector(".main-holder");
  mainHolder.classList.add("chat-open");

  // Ensure the chat history holder exists
  let chatHistory = document.querySelector(".chat-history-holder");
  if (!chatHistory) {
    chatHistory = document.createElement("div");
    chatHistory.className = "chat-history-holder";
    const pageInfoHolder = document.querySelector(".page-info-holder");
    pageInfoHolder.insertAdjacentElement("afterend", chatHistory);
    mainHolder.classList.add("chat-open");
  }

  // Append user message to chat history
  const userChat = document.createElement("div");
  userChat.className = "chat user";
  userChat.innerHTML = `<div class="text">${message}</div>`;
  chatHistory.appendChild(userChat);

  // Clear the input field
  input.value = "";

  // Ensure the session is initialized
  await initializeSession();

  // Generate and stream the response
  try {
    // Create a new system message holder for streaming
    const systemChat = document.createElement("div");
    systemChat.className = "chat system";
    const textDiv = document.createElement("div");
    textDiv.className = "text";
    systemChat.appendChild(textDiv);
    chatHistory.appendChild(systemChat);

    // Stream the response
    const stream = session.promptStreaming(message);
    let fullResponse = ""; // To track the full response as it's streamed
    for await (const chunk of stream) {
      textDiv.textContent = chunk; // Update the UI with streamed chunks
      chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll with each chunk
    }

    // Scroll to the bottom of chat history after streaming completes
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error("Error generating response:", error);

    // Handle error gracefully in the chat UI
    const errorChat = document.createElement("div");
    errorChat.className = "chat system error";
    errorChat.innerHTML = `<div class="text">An error occurred. Please try again later.</div>`;
    chatHistory.appendChild(errorChat);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

// Event listener for send button
document
  .getElementById("send-btn")
  .addEventListener("click", handleSendMessage);

// Optional: Initialize session on page load
initializeSession();
