import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AiSessionProvider } from "./hook/AiSessionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AiSessionProvider>
      <App />
    </AiSessionProvider>
  </StrictMode>
);
