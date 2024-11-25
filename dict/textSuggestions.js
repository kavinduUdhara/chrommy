// Function to get the cursor position and the last sentence before the cursor
function getCursorPosition(textarea) {
  const cursorPos = textarea.selectionStart;
  const textBeforeCursor = textarea.value.slice(0, cursorPos);
  const sentences = textBeforeCursor.split('.').map((sentence) => sentence.trim());
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

// Function to insert the suggestion into the textarea inline, without modifying the content immediately
function insertSuggestion(textarea, suggestion) {
  const { cursorPos, lastSentence } = getCursorPosition(textarea);
  const textBeforeCursor = textarea.value.slice(0, cursorPos - lastSentence.length);
  const textAfterCursor = textarea.value.slice(cursorPos);
  const suggestedText = textBeforeCursor + lastSentence + " " + suggestion + textAfterCursor;

  // Store the suggestion temporarily in the textarea's data attribute
  textarea.setAttribute("data-suggestion", suggestedText);

  // Display the suggestion inline without immediately modifying the content
  displayInlineSuggestion(textarea, suggestion);
}


function displayInlineSuggestion(textarea, suggestion) {
  // Create or update the suggestion box that appears inline with the text area
  //change the bgclor of textarea
  textarea.style.backgroundColor = "#f0f0f0";
  let suggestionBox = document.querySelector(".inline-suggestion");
  if (!suggestionBox) {
    suggestionBox = document.createElement("span");
    suggestionBox.classList.add("inline-suggestion");
    suggestionBox.style.position = "absolute";
    suggestionBox.style.zIndex = "9999";
    suggestionBox.style.backgroundColor = "#f0f0f0";
    suggestionBox.style.padding = "2px 4px";
    suggestionBox.style.border = "1px solid #ccc";
    suggestionBox.style.borderRadius = "3px";
    document.body.appendChild(suggestionBox);
  }

  // Position the suggestion box correctly inside the textarea
  const { cursorPos } = getCursorPosition(textarea);
  const rect = textarea.getBoundingClientRect();
  suggestionBox.style.top = rect.top + window.scrollY + "px";
  suggestionBox.style.left = rect.left + window.scrollX + cursorPos + "px";
  suggestionBox.textContent = suggestion;
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
    if (suggestion) {
      textarea.value = suggestion;
      textarea.removeAttribute("data-suggestion"); // Clear suggestion after inserting
    }
  }
});

// Clear the suggestion if the user types anything after the suggestion
document.addEventListener("keydown", (event) => {
  const textarea = event.target;

  if (textarea && textarea.tagName === "TEXTAREA") {
    // Check if the user typed anything after the suggestion
    const currentText = textarea.value;
    if (currentText !== textarea.getAttribute("data-suggestion")) {
      textarea.removeAttribute("data-suggestion"); // Clear the suggestion
    }
  }
});
