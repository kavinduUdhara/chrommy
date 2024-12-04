# Chrommy | AI-Powered Chrome Extension: Smart Summaries and Chat Assistance  
![chrommy](https://github.com/user-attachments/assets/a8946c68-e9f9-4026-978b-5234aead0b57)


## Introduction  
This project was built for the **Google Chrome Built-In AI Challenge**. It is a Chrome extension designed to revolutionize how users interact with web content by leveraging AI for smarter, more efficient browsing.  

## Project Structure & Build Guide

### Overview
This repository contains the source code for Chrommy, a Chrome extension that acts as your copilot for a smarter web journey. Below is a quick guide to understand the structure of the project and how to build and load the extension.

### Key Directories
- `dict/` : This is the core directory containing all files needed to load the Chrome extension.
    - Includes background scripts (background.js), content scripts (content.js), the manifest file (manifest.json), and UI components like the pop-up and side panel.
- `vite/` : Contains the source code for the side panel, developed using Vite and React.
      - The built side panel files are outputted to ./dict/sidePanel after processing with Vite.

### How to Build and Run the Extension
1. Clone the Repository
     ```bash
    git clone https://github.com/kavinduUdhara/chrommy.git
    cd chrommy
     ```
2. Install Dependencies for Vite
    Navigate to the vite/ directory and install the necessary dependencies:
   ```bash
   cd vite
   npm install
   ```
3. Build the Side Panel
   Run the build command to compile the side panel React code into `./dict/sidePanel`:
   ```bash
   npm run build
   ```
4. Load the Extension into Chrome  
    1. Open Chrome and navigate to `chrome://extensions/`.
    2. Enable Developer Mode in the top-right corner.
    3. Click Load Unpacked and select the `./dict` folder.
5. Start Using Chrommy
   - Press Ctrl+Shift+Z (or Command+Shift+Z on Mac) to open the side panel.
   - Interact with the pop-up and other features to explore the extension’s capabilities.
  
### Development Notes
- All background scripts and content scripts live in the ./dict directory.
- All side panel-related features are developed in ./vite and built into ./dict/sidePanel using Vite.
By keeping this structure organized, you can easily extend or modify the extension as needed.

## Features  
- **Web Page Summarization**: Summarize the current webpage content with a single click.  
- **Follow-Up Questions**: Dive deeper by asking follow-up questions about the summarized content.  
- **AI Chat Assistant**: An all-purpose chat assistant right within your browser.  
- **Chat History**: Save and revisit past conversations effortlessly.  
- **Predictive Typing**: Get real-time sentence predictions while typing in any text field.  

## Inspiration  
The idea was born out of the challenge itself—I discovered the competition while researching Google DevTest and decided to push my boundaries. The prospect of building something impactful, like a Chrome extension, inspired me to create this in just two weeks.  

## Tech Stack  
- **Vite**: For building a fast and modular development environment.  
- **TailwindCSS**: For designing a responsive and sleek user interface.  
- **JavaScript & Chrome APIs**: To enable seamless integration with the browser's capabilities.  

## How It Works  
1. Install the extension and pin it to your Chrome toolbar.  
2. Open any webpage and activate the sidebar.  
3. Summarize content, ask follow-up questions, or use the AI assistant for general queries.  
4. Personalize the experience by saving chat history or providing user-specific data for enhanced sessions.  

## Challenges  
- Fine-tuning the AI chat API responses for accuracy and reliability.  
- Overcoming UI design hurdles to ensure a user-friendly experience.  
- Testing and debugging edge cases within Chrome’s extension ecosystem.  

## Accomplishments  
- Successfully built a feature-rich Chrome extension in just two weeks.  
- Gained valuable insights into Chrome extension development and AI integration.  
- Pushed through challenges with persistence and learned the art of rapid prototyping.  

## Lessons Learned  
This project taught me:  
- The fundamentals of Chrome extension development, including background scripts and side panels.  
- The power of combining AI tools with browser functionalities.  
- How to manage an open-source project and write clean, modular code.  
