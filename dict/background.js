chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: openPopUpSummary
  });
});

// Add keyboard shortcut for opening promptPopUp
chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: openPromptPopUp
        });
      }
    });
  }
});

// Function to display the popUpSummary
function openPopUpSummary() {
  const existingPopUp = document.getElementById("popUpSummary");
  if (existingPopUp) return; // Prevent multiple pop-ups

  const popUp = document.createElement("div");
  popUp.id = "popUpSummary";
  popUp.style.position = "fixed";
  popUp.style.top = "10px";
  popUp.style.right = "10px";
  popUp.style.width = "300px";
  popUp.style.background = "white";
  popUp.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  popUp.style.border = "1px solid #ccc";
  popUp.style.padding = "10px";
  popUp.style.zIndex = "9999";

  const title = document.createElement("h2");
  title.textContent = "Page Summary";

  const url = document.createElement("p");
  url.textContent = `URL: ${window.location.href}`;
  url.style.fontSize = "14px";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = "10px";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => document.body.removeChild(popUp);

  popUp.appendChild(title);
  popUp.appendChild(url);
  popUp.appendChild(closeButton);
  document.body.appendChild(popUp);
}

// Function to display the promptPopUp
function openPromptPopUp() {
  const existingPrompt = document.getElementById("promptPopUp");
  if (existingPrompt) return; // Prevent multiple prompts

  const promptPopUp = document.createElement("div");
  promptPopUp.id = "promptPopUp";
  promptPopUp.style.position = "fixed";
  promptPopUp.style.top = "20%";
  promptPopUp.style.left = "50%";
  promptPopUp.style.transform = "translate(-50%, -50%)";
  promptPopUp.style.width = "400px";
  promptPopUp.style.background = "white";
  promptPopUp.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  promptPopUp.style.border = "1px solid #ccc";
  promptPopUp.style.padding = "20px";
  promptPopUp.style.zIndex = "9999";

  const title = document.createElement("h2");
  title.textContent = "Chat with AI";

  const textarea = document.createElement("textarea");
  textarea.style.width = "100%";
  textarea.style.height = "100px";
  textarea.style.marginTop = "10px";
  textarea.style.padding = "10px";

  const sendButton = document.createElement("button");
  sendButton.textContent = "Send";
  sendButton.style.marginTop = "10px";
  sendButton.style.padding = "5px 10px";
  sendButton.style.cursor = "pointer";
  sendButton.onclick = () => alert(`You said: ${textarea.value}`);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = "10px";
  closeButton.style.marginLeft = "10px";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => document.body.removeChild(promptPopUp);

  promptPopUp.appendChild(title);
  promptPopUp.appendChild(textarea);
  promptPopUp.appendChild(sendButton);
  promptPopUp.appendChild(closeButton);
  document.body.appendChild(promptPopUp);
}
