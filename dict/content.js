chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getFavicon") {
    const linkElement = document.querySelector('link[rel~="icon"]');
    const faviconUrl = linkElement ? linkElement.href : null;
    sendResponse({ favicon: faviconUrl });
  }
});


const extractPageData = () => {
  // Select all relevant elements in the document flow
  const elements = Array.from(
    document.querySelectorAll("h1, h2, h3, p, ul, ol")
  );

  // Map elements to structured data
  const content = elements.map((el) => {
    let textContent;

    if (el.tagName.toLowerCase() === "ul" || el.tagName.toLowerCase() === "ol") {
      // For lists, extract the text of all list items
      const listItems = Array.from(el.querySelectorAll("li")).map((li) =>
        li.innerText.trim()
      );
      textContent = listItems.join("\n"); // Join list items with newlines
    } else {
      // For other tags, just extract text
      textContent = el.innerText.trim();
    }

    return {
      tag: el.tagName.toLowerCase(), // Get the tag type (e.g., h1, h2, p, ul, ol)
      text: textContent, // Extracted and cleaned up text content
    };
  });

  return {
    content, // An array of elements in order
    url: window.location.href, // Page URL
    title: document.title, // Page title
  };
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractData") {
    const pageData = extractPageData();
    sendResponse(pageData);
  }
});