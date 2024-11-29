import { useEffect, useState } from "react";
import ChatPreview from "./ChatPreview";
import { createAiSession, promptAI } from "./hook/useSession";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const session = await createAiSession();
        setSession(session);
      } catch (error) {
        console.error("Error with AI session:", error);
        return(
          <div>Error: {error}</div>
        )
      }
    }
    init();
  }, []);
  if(session){
    return <ChatPreview promptAI={promptAI} session={session}/>;
  }
}

export default App;
