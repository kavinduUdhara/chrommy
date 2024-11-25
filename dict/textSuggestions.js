// Function to get the cursor position and the last sentence before the cursor
function getCursorPosition(textarea) {
  const cursorPos = textarea.selectionStart;
  const textBeforeCursor = textarea.value.slice(0, cursorPos);
  const sentences = textBeforeCursor
    .split(".")
    .map((sentence) => sentence.trim());
  const lastSentence = sentences[sentences.length - 1]; // Last sentence before the cursor
  return { cursorPos, lastSentence };
}

// Function to send message to background script and get the suggestion
function getPrediction(textarea) {
  const { lastSentence } = getCursorPosition(textarea);

  if (lastSentence.length > 0) {
    console.log("Sending message to background script...");
    chrome.runtime.sendMessage(
      { action: "predict", text: lastSentence },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error in message passing:", chrome.runtime.lastError);
        } else {
          const prediction = response.prediction;
          insertSuggestion(textarea, prediction);
        }
      }
    );
  }
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
    overlay.style.bottom = `${window.innerHeight - inputRect.bottom - window.scrollY}px`;
    overlay.style.left = `${inputRect.left + window.scrollX}px`;
    overlay.style.right = `${window.innerWidth - inputRect.right - window.scrollX}px`;

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
    overlay.innerHTML = `${inputElement.value}<span style="background: yellow;">${suggestions}</span>`;
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
}





// Listen for user input in the textarea
document.addEventListener("input", (event) => {
  const textarea = event.target;

  if (textarea && textarea.tagName === "TEXTAREA") {
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
    console.log("suggestion",suggestion);
    if (suggestion) {
      textarea.value = suggestion;
      textarea.removeAttribute("data-suggestion");
    }
  }
});