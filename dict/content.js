chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getFavicon") {
      const linkElement = document.querySelector('link[rel~="icon"]');
      const faviconUrl = linkElement ? linkElement.href : null;
      sendResponse({ favicon: faviconUrl });
    }
  });
  