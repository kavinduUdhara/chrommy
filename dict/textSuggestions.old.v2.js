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
  // Create or update the suggestion box that appears above the textarea
  let suggestionBox = document.querySelector(".inline-suggestion");
  if (!suggestionBox) {
    suggestionBox = document.createElement("span");
    suggestionBox.classList.add("inline-suggestion");
    suggestionBox.classList.add("suggestion-box");
    //add the svg into the suggestion box 
    suggestionBox.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M11.59 7.41 15.17 11H1v2h14.17l-3.59 3.59L13 18l6-6-6-6-1.41 1.41zM20 6v12h2V6h-2z"></path></svg>`;
    document.body.appendChild(suggestionBox);
  }

  // Position the suggestion box above the textarea
  const rect = textarea.getBoundingClientRect();

  // Adjust the top position to be above the textarea
  suggestionBox.style.top = rect.top + window.scrollY - suggestionBox.offsetHeight - 5 + "px"; // 5px for spacing
  //alight it with right side of the text area
  suggestionBox.style.right = rect.left + window.scrollX + 5 + "px"; // Adjusting for width and 5px spacing

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
      textarea.removeAttribute("data-suggestion");
      //remove the element that have classname of suggestion-box
      document.querySelector(".suggestion-box").remove();
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
