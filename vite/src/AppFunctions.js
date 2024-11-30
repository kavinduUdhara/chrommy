const loadTheActiveTabInfo = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        const tab = tabs[0];
        const url = new URL(tab.url);
        const domain = url.hostname;

        // Get the favicon from the content script
        chrome.tabs.sendMessage(
          tab.id,
          { action: "getFavicon" },
          (response) => {
            const faviconUrl = response?.favicon || null;
            // Resolve the Promise with tab information
            resolve({ tab: tab.title, domain: domain, favicon: faviconUrl });
          }
        );
      } else {
        // No active tab found, resolve with default values
        resolve({ tab: null, domain: null, favicon: null });
      }
    });
  });
};

async function checkFaviconBrightness(faviconUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = faviconUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;
      let whitePixelCount = 0;
      const totalPixels = pixels.length / 4; // Total number of pixels

      // Loop through all the pixels and count how many are close to white
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]; // Red
        const g = pixels[i + 1]; // Green
        const b = pixels[i + 2]; // Blue

        // Check if the pixel is close to white (all RGB values are close to 255)
        if (r > 250 && g > 250 && b > 250) {
          whitePixelCount++;
        }
      }

      // Calculate the percentage of white pixels
      const whitePercentage = (whitePixelCount / totalPixels) * 100;

      // Resolve based on brightness threshold
      resolve(whitePercentage > 50); // More than 51% white pixels considered "bright"
    };

    // Handle errors gracefully
    img.onerror = function () {
      reject("Failed to load favicon image.");
    };
  });
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 18) return "Good Afternoon!";
  return "Good Evening!";
};

const getWebsiteContent = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "extractData" },
          (response) => {
            if (chrome.runtime.lastError || !response) {
              reject("Failed to fetch page data");
            } else {
              resolve(response);
            }
          }
        );
      } else {
        reject("No active tab found");
      }
    });
  });
};

import { v4 as uuidv4 } from 'uuid';

const getUniqueID = () => {
  return uuidv4();
}

import { remark } from "remark";
import remarkRehype from "remark-rehype";
import remarkDirective from "remark-directive";
import rehypeStringify from "rehype-stringify";
const markdownToHtml = async (markdownContent) => {
  try {
    const result = await remark()
      .use(remarkDirective)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdownContent);

    console.log("Final HTML output:", result.toString());
    return result.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
  }
};

import parse from "html-react-parser";
const parseHtml = async (markdown) => {
  try {
    const html = await markdownToHtml(markdown); // Wait for the HTML conversion
    return parse(html); // Parse the resulting HTML
  } catch (error) {
    console.error("Error parsing markdown to HTML:", error);
    return null; // Return null or a fallback value on error
  }
};

export { loadTheActiveTabInfo, checkFaviconBrightness, getGreeting, getUniqueID, getWebsiteContent, parseHtml };
