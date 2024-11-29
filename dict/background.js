chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  await chrome.sidePanel.setOptions({
    tabId,
    path: "sidePanel/index.html",
    enabled: true,
  });
});
