chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getFavicon") {
    const linkElement = document.querySelector('link[rel~="icon"]');
    const faviconUrl = linkElement ? linkElement.href : null;
    sendResponse({ favicon: faviconUrl });
  }
});

const extractPageDataAsMarkdown = () => {
  // Select the <article> tag if it exists, otherwise fall back to the whole document
  const container = document.querySelector("article") || document.body;

  // Select all relevant elements within the container
  const elements = Array.from(
    container.querySelectorAll("h1, h2, h3, p, ul, ol")
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
      text: textContent, // Extracted and cleaned-up text content
    };
  });

  // Convert the extracted content into Markdown format
  let markdown = `# ${document.title}\n\n[Source URL](${window.location.href})\n\n`;

  content.forEach(({ tag, text }) => {
    switch (tag) {
      case "h1":
        markdown += `# ${text}\n\n`;
        break;
      case "h2":
        markdown += `## ${text}\n\n`;
        break;
      case "h3":
        markdown += `### ${text}\n\n`;
        break;
      case "p":
        markdown += `${text}\n\n`;
        break;
      case "ul":
      case "ol":
        const listSyntax = tag === "ul" ? "- " : "1. ";
        markdown += text
          .split("\n")
          .map((item) => `${listSyntax}${item}`)
          .join("\n");
        markdown += `\n\n`;
        break;
      default:
        break;
    }
  });

  return markdown.trim(); // Return the formatted Markdown text
};


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractData") {
    const pageData = extractPageDataAsMarkdown();
    sendResponse(pageData);
  }
});