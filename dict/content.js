chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getFavicon") {
    const linkElement = document.querySelector('link[rel~="icon"]');
    const faviconUrl = linkElement ? linkElement.href : null;
    sendResponse({ favicon: faviconUrl });
  }
});

//desided to not to use more advanced due to incresed response time: https://chatgpt.com/share/674b6061-baa0-800b-bc6e-1e38b5c5c919
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

    if (
      el.tagName.toLowerCase() === "ul" ||
      el.tagName.toLowerCase() === "ol"
    ) {
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

  console.log(markdown.trim()); // Log the formatted Markdown text

  return markdown.trim(); // Return the formatted Markdown text
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractData") {
    const pageData = extractPageDataAsMarkdown();
    sendResponse(pageData);
  }
});

//extract youtube data
// content.js

// Utility function to simulate a delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to extract the YouTube transcript
async function extractYouTubeTranscript() {
  try {
    // Ensure the transcript button exists and is visible
    const transcriptButton = [
      ...document.querySelectorAll("button[aria-label='Show transcript']"),
    ].find((btn) => btn.textContent.trim() === "Show transcript");

    if (!transcriptButton) {
      console.error(
        "Transcript button not found. Ensure the video has a transcript available."
      );
      return { success: false, message: "Transcript button not found." };
    }

    // Click the transcript button to open the transcript panel
    transcriptButton.click();
    console.log("Clicked on the transcript button.");

    // Retry logic to check for the transcript container
    const observer = new MutationObserver((mutationsList, observer) => {
      const transcriptContainer = document.querySelector(
        "ytd-transcript-renderer"
      );
      if (transcriptContainer) {
        console.log("Transcript container found:", transcriptContainer);
        observer.disconnect();

        const segments = transcriptContainer.querySelectorAll(".segment");

        if (!segments.length) {
          console.error("No transcript items found. Transcript may be empty.");
          chrome.runtime.sendMessage({
            success: false,
            message: "Transcript items not found.",
          });
          return;
        }

        const transcript = Array.from(segments).map((segment) => {
          const timestamp = segment
            .querySelector(".segment-timestamp")
            .textContent.trim();
          const text = segment
            .querySelector(".segment-text")
            .textContent.trim();
          return `[${timestamp}] ${text}`;
        });

        console.log("Transcript extracted successfully:", transcript);
        chrome.runtime.sendMessage({ success: true, transcript });
      } else {
        console.log("Transcript container not yet available.");
      }
    });

    // Observe changes in the DOM
    const targetNode = document.body; // Root of the page where changes occur
    const config = { childList: true, subtree: true }; // Watch for all DOM changes
    observer.observe(targetNode, config);

    // Fallback to ensure the observer doesn't wait indefinitely
    setTimeout(() => {
      observer.disconnect();
      console.error("Transcript container not found within the time limit.");
    }, 10000); // Stop after 10 seconds if the container does not appear
  } catch (error) {
    console.error(
      "An error occurred while extracting the YouTube transcript:",
      error
    );
    chrome.runtime.sendMessage({ success: false, message: error.message });
  }
}

// Listen for messages from the extension popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractTranscript") {
    extractYouTubeTranscript().then((response) => sendResponse(response));
    return true; // Keep the message channel open for asynchronous response
  }
});
