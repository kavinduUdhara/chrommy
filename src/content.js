// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom";
import "./content.css";

// Simple React component for the pop-up
function Popup() {
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Welcome to Your Extension!</h2>
        <p>This pop-up is displayed inside the webpage.</p>
        <button onClick={() => alert("Hello!")}>Click Me</button>
      </div>
    </div>
  );
}

// Add a container div to the webpage for the React app
const appContainer = document.createElement("div");
appContainer.id = "my-extension-popup";
document.body.appendChild(appContainer);

// Render the React app
ReactDOM.createRoot(appContainer).render(<Popup />);
