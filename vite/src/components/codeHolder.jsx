import "./codeHolder.css";

import { IoCodeOutline } from "react-icons/io5";
import { TbCopy } from "react-icons/tb";
import toast from 'react-hot-toast';

export default function CodeHolder({ children, lang }) {
  const copyCode = () => {
    // Select the code element
    const codeElement = document.querySelector(".code-holder .code code");

    if (codeElement) {
      // Use the Clipboard API to copy the text content
      navigator.clipboard
        .writeText(codeElement.textContent)
        .then(() => {
          toast.success('Code copied to clipboard!');
        })
        .catch((error) => {
          console.error("Failed to copy code:", error);
          alert("Failed to copy code. Please try again.");
        });
    }
  };

  return (
    <div className="code-holder">
      <div className="code-title">
        <div className="code-lang">
          <IoCodeOutline /> {lang || "code"}
        </div>
        <div className="ac-btns">
          <button onClick={copyCode}>
            <TbCopy /> Copy
          </button>
        </div>
      </div>
      <div className="code">
        {children}
      </div>
    </div>
  );
}
