import { useEffect } from "react";

export default function useAutoResizeTextBox(ref, maxHeight = 100) {
  useEffect(() => {
    const handleInput = (event) => {
      const textarea = event.target;

      // Check if the event is for the bound textarea
      if (ref.current && textarea === ref.current) {
        const parent = textarea.closest(".chat-box-send");

        // Reset height to auto to calculate the new height
        textarea.style.height = "auto";

        // Set height to the scroll height or max height
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

        // Add or remove 'multiline' class based on the height
        if (textarea.scrollHeight > 40) {
          parent?.classList.add("multiline");
        } else {
          parent?.classList.remove("multiline");
        }
      }
    };

    // Attach the event listener
    document.addEventListener("input", handleInput);

    // Cleanup on unmount
    return () => document.removeEventListener("input", handleInput);
  }, [ref, maxHeight]);
}
