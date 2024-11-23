chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting']
    });
  }
})

import './popUp/popUpSummary.js';