function insertStyles() {
  // Create a new <style> element
  const style = document.createElement('style');
  style.type = 'text/css';  // Set the type to CSS

  // Add your CSS rules inside the <style> element
  const css = `
    .container {
      position: relative;
    }
    .container__textarea {
      background: transparent;
      position: relative;
    }
    .container__mirror {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .container__pre-cursor {
      color: transparent;
    }
    .container__post-cursor {
      opacity: 0.4;
    }
  `;

  // Add the CSS text to the <style> element
  style.textContent = css;

  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);
}

// Call the function to insert the styles
insertStyles();

// Add event listeners to detect typing in text areas
document.addEventListener("input", (event) => {
  if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
    const text = event.target.value;

    // Send the current text to the background script for prediction
    chrome.runtime.sendMessage({ action: "predict", text }, (response) => {
      if (response?.prediction) {
        showSuggestion(event.target, response.prediction);
      }
    });
  }
});

// Add keydown listener to accept the suggestion
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && currentSuggestion) {
    event.preventDefault(); // Prevent the default tab behavior
    const target = document.activeElement;

    if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) {
      target.value += currentSuggestion; // Append the suggestion to the input
      clearSuggestion(); // Clear the suggestion
    }
  }
});

let currentSuggestion = null; // Store the current suggestion
let suggestionElement = null; // Store the suggestion overlay element

function showSuggestion(inputElement, suggestion) {
  clearSuggestion(); // Clear any existing suggestion

  currentSuggestion = suggestion;

  // Create an overlay for the suggestion
  suggestionElement = document.createElement("div");
  suggestionElement.className = "suggestion-overlay";
  suggestionElement.textContent = suggestion;

  // Add a visual Tab indicator
  const tabIcon = document.createElement("span");
  tabIcon.className = "tab-icon";
  tabIcon.textContent = "⭾"; // Unicode character for Tab
  suggestionElement.appendChild(tabIcon);

  // Append the element to the body to calculate its height
  document.body.appendChild(suggestionElement);

  // Get the height of the suggestion element after it's been rendered
  const suggestionHeight = suggestionElement.offsetHeight;
  const suggestionWidth = suggestionElement.offsetWidth;

  // Style the overlay
  const rect = inputElement.getBoundingClientRect();
  suggestionElement.style.position = "absolute";
  suggestionElement.style.left = `${rect.left + rect.width - suggestionWidth + window.scrollX}px`; // Position on the right side
  suggestionElement.style.top = `${rect.top + window.scrollY - suggestionHeight}px`; // Position above the input field
  suggestionElement.style.color = "rgba(0, 0, 0, 0.6)";
  suggestionElement.style.background = "transparent";
  suggestionElement.style.pointerEvents = "none";
  suggestionElement.style.fontSize = getComputedStyle(inputElement).fontSize;

  // Remove the element from the DOM after getting its dimensions
  document.body.removeChild(suggestionElement);

  // Add the suggestion element back to the body for display
  document.body.appendChild(suggestionElement);
}

function clearSuggestion() {
  if (suggestionElement) {
    suggestionElement.remove();
    suggestionElement = null;
  }
  currentSuggestion = null;
}

// Sample prediction logic
function predictNextWord(text) {
  const words = ["world", "friend", "code", "example"];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

// Handle messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "predict" && message.text) {
    const prediction = predictNextWord(message.text);
    sendResponse({ prediction });
  }
});