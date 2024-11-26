// Function to send a message to the background script and get the suggestion
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

let available = null;
let session = null;

// Function to send message to background script and get the suggestion
async function getPrediction(textarea) {
  if (session) {
    await session.clone();
    console.log("sesstion updated");
  }
  if (!available) {
    try {
      // Fetch capabilities and initialize session if available
      const {
        available: isAvailable,
        defaultTemperature,
        defaultTopK,
        maxTopK,
      } = await ai.languageModel.capabilities();

      available = isAvailable; // Update global `available` variable

      if (available !== "no") {
        session = await ai.languageModel.create({
          systemPrompt: `
          You are a sentence completion assistant. Your task is to continue a given sentence without repeating any words from the original sentence. If the sentence appears complete, add nothing.

Instructions:
1. Carefully read the incomplete sentence provided below.
2. If the sentence requires further words to feel complete, generate a continuation that seamlessly flows from the original text.  Do not repeat any words from the original sentence in your continuation.
3. If the provided sentence feels complete, output nothing (an empty string).

example 1:
Incomplete Sentence: "The quick brown fox "
Expected Output: "jumped over the lazy dog"
Bad Output: "The quick brown fox jumped over the lazy dog" (repeated words)

example 2:
Incomplete Sentence: "The sun was setting behind the mountains"
Expected Output: " casting a warm orange glow across the sky."
Bad Output: "The sun was setting behind the mountains casting a warm orange glow across the sky." (repeated words)

example 3:
Incomplete Sentence: "After a long day at work"
Expected Output: " she decided to relax with a cup of tea and a good book."
Bad Output: "After a long day at work she decided to relax with a cup of tea and a good book." (repeated words)
          `,
        });
        console.log("Session created:", session);
      } else {
        console.warn("Language model capabilities are unavailable.");
      }
    } catch (error) {
      console.error("Error initializing AI capabilities:", error);
      return; // Exit the function if session creation fails
    }
  }

  // Ensure a valid session exists before proceeding
  if (session && available !== "no") {
    const lastSentence = textarea.value;

    if (lastSentence.length > 5) {
      try {
        //         const prompt = `
        // Continue writing from the end of the following text without repeating or rephrasing any part of it. Stop after completing exactly one coherent sentence.
        // If the text feels complete and no continuation is needed, return nothing (an empty string) instead.
        // Do not repeat or restate any words or phrases from the input.
        // Never attempt to reply or generate output for the sentence itself.
        // Input: ${lastSentence}
        // `;
        const prompt = `
You are a sentence completion assistant. Your task is to continue a given sentence without repeating any words from the original sentence. If the sentence appears complete, add nothing.

Instructions:
1. Carefully read the incomplete sentence provided below.
2. If the sentence requires further words to feel complete, generate a continuation that seamlessly flows from the original text.  Do not repeat any words from the original(incomplete) sentence in your continuation.
3. If the provided sentence feels complete, output nothing (an empty string).

Incomplete Sentence: "${lastSentence}"
`;
        console.log("Prompt:", prompt);
        // Use the session to generate a prediction stream
        const stream = session.promptStreaming(prompt);
        for await (const chunk of stream) {
          console.log("Chunk:", chunk);
          let cleanedOutput = cleanOutput(lastSentence, chunk)
          cleanedOutput = cleanedOutput.replace(/^\s*"\s*|\s*"\s*$/g, ''); //clean the " at the start and end of the string
          insertSuggestion(textarea, cleanedOutput);
        }
      } catch (error) {
        console.error("Error in prediction stream:", error);
      }
    }
  } else {
    console.warn("Session is not available. Unable to process prediction.");
  }
}

function cleanOutput(input, output) {
  // Normalize case for comparison
  const inputLower = input.trim().toLowerCase();
  const outputLower = output.trim().toLowerCase();

  // Split into words for tokenized comparison
  const inputWords = inputLower.split(/\s+/);
  const outputWords = outputLower.split(/\s+/);

  // Check if the start of the output matches the end of the input
  const overlapIndex = inputWords.reduce((overlap, word, index) => {
    if (outputLower.startsWith(inputWords.slice(index).join(" "))) {
      overlap = index; // Update overlap starting position
    }
    return overlap;
  }, null);

  if (overlapIndex !== null) {
    const filteredOutput = outputWords.slice(
      inputWords.slice(overlapIndex).length
    );
    return filteredOutput.join(" ");
  }

  // If no overlap is found, return the original output
  return output;
}

//doc: https://chatgpt.com/share/6744ceac-61b8-800b-a44a-2eea5b8c9353

// Function to insert the suggestion into the textarea inline, without modifying the content immediately
function insertSuggestion(textarea, suggestion) {
  // Avoid duplicating lastSentence by working only with the current content
  const text = textarea.value;

  // Formulate the suggestion text without duplicating the last sentence
  const suggestedText = text + suggestion;

  // Store the suggestion temporarily in the textarea's data attribute
  textarea.setAttribute("data-suggestion", suggestedText);

  // Display the suggestion inline without modifying the content
  displayInlineSuggestion(textarea, suggestion);
}

//doc: https://chatgpt.com/share/6744ceac-61b8-800b-a44a-2eea5b8c9353
function displayInlineSuggestion(inputElement, suggestions) {
  // Create or reuse the overlay
  let overlay = document.querySelector(".suggestions-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "suggestions-overlay";
    overlay.style.position = "absolute";
    overlay.style.color = "transparent";
    overlay.style.pointerEvents = "none";
    overlay.style.whiteSpace = "pre-wrap";
    overlay.style.overflow = "hidden";
    overlay.style.zIndex = "100000000"; // Ensure it's above other elements
    document.body.appendChild(overlay);
  }

  // Function to calculate dimensions and position
  const updateOverlay = () => {
    const inputRect = inputElement.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(inputElement);

    // Apply dimensions and position
    // overlay.style.width = `${inputRect.width}px`;
    // overlay.style.height = `${inputRect.height}px`;
    overlay.style.top = `${inputRect.top + window.scrollY}px`;
    overlay.style.bottom = `${
      window.innerHeight - inputRect.bottom - window.scrollY
    }px`;
    overlay.style.left = `${inputRect.left + window.scrollX}px`;
    overlay.style.right = `${
      window.innerWidth - inputRect.right - window.scrollX
    }px`;

    // Sync styles from input
    overlay.style.padding = computedStyles.padding;
    overlay.style.font = computedStyles.font;
    overlay.style.lineHeight = computedStyles.lineHeight;
    overlay.style.borderRadius = computedStyles.borderRadius;
    overlay.style.textAlign = computedStyles.textAlign;
    overlay.style.letterSpacing = computedStyles.letterSpacing;
    overlay.style.border = computedStyles.border;
    overlay.style.boxSizing = computedStyles.boxSizing;
    overlay.style.backgroundColor = "transparent"; // Ensure no background interference
  };

  // Function to update content with suggestions
  const updateContent = () => {
    overlay.innerHTML = `${inputElement.value}<span>${suggestions}</span><span class="tab">TAB</span>`;
  };

  // Initialize overlay
  updateOverlay();
  updateContent();

  // Update overlay on input, window resize, and scroll
  inputElement.addEventListener("input", () => {
    updateOverlay();
    updateContent();
  });
  window.addEventListener("resize", updateOverlay);
  window.addEventListener("scroll", updateOverlay);

  // Sync scrolling
  inputElement.addEventListener("scroll", () => {
    overlay.scrollTop = inputElement.scrollTop;
    overlay.scrollLeft = inputElement.scrollLeft;
  });

  // Using ResizeObserver to detect changes in textarea size
  const resizeObserver = new ResizeObserver(() => {
    updateOverlay(); // Trigger update when the textarea resizes
  });

  // Observe the inputElement's resize events
  resizeObserver.observe(inputElement);

  // Remove ResizeObserver when no longer needed (optional cleanup)
  inputElement.addEventListener("remove", () => {
    resizeObserver.disconnect();
  });
}

// Listen for user input in the textarea
document.addEventListener("input", (event) => {
  const textarea = event.target;

  //clear the suggestion when new input is detected
  textarea.removeAttribute("data-suggestion");
  const overlay = document.querySelector(".suggestions-overlay");
  if (overlay) {
    overlay.remove();
  }

  if (textarea && textarea.tagName === "TEXTAREA") {
    const currentValue = textarea.value;

    // Check if the change is caused by Backspace or editing anywhere but the end
    const inputType = event.inputType;
    const cursorPosition = textarea.selectionStart;

    // Clear suggestions if Backspace is detected or editing is not at the end
    if (
      inputType === "deleteContentBackward" ||
      cursorPosition !== currentValue.length
    ) {
      return;
    }

    // Generate prediction only if editing at the end
    getPrediction(textarea);
  }
});
// Handle Tab key for inserting suggestions
document.addEventListener("keydown", (event) => {
  const textarea = event.target;

  if (event.key === "Tab" && textarea && textarea.tagName === "TEXTAREA") {
    // Prevent default tab behavior
    event.preventDefault();

    // Insert the suggestion from the data attribute
    const suggestion = textarea.getAttribute("data-suggestion");
    console.log("suggestion", suggestion);
    if (suggestion) {
      textarea.value = suggestion;
      textarea.removeAttribute("data-suggestion");
      const overlay = document.querySelector(".suggestions-overlay");
      if (overlay) {
        overlay.innerHTML = "";
      }
    }
  }
});
