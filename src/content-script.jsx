import React from "react";
import ReactDOM from "react-dom";

const App = () => (
  <div className="custom-popup">
    <h1>Injected Pop-Up</h1>
    <p>This pop-up appears inside the webpage.</p>
  </div>
);

const container = document.createElement("div");
container.id = "injected-popup";
document.body.appendChild(container);

ReactDOM.createRoot(container).render(<App />);