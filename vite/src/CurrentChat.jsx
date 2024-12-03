import { useEffect, useState } from "react";
import ChatPreview from "./ChatPreview";
import { createAiSession, promptAI } from "./hook/useSession";
import { Toaster } from "react-hot-toast";

import { getPreferenceByID } from "./lib/chatHistoryDB";

const loadPreferences = async () => {
  const existingPreferences = await getPreferenceByID("userInfo");
  if (existingPreferences) {
    return existingPreferences.data;
  } else return {
    firstName: null,
    lastName: null,
    age: null,
    pronouns: null,
    email: null,
    phone: null,
    address: null,
    topics: null,
    languageTone: null,
    reaplyPreference: null,
  };
};

export default function CurrentChat() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const userdata = await loadPreferences();
        console.log("User Data:", userdata);
        const session = await createAiSession(userdata);
        setSession(session);
      } catch (error) {
        console.error("Error with AI session:", error);
        setError(error.message || "error");
        return <div>Error: {error}</div>;
      }
    }
    init();
  }, []);
  if (error){
    return <div>Error: {error}</div>;
  }
  if (session) {
    return (
      <>
        <ChatPreview promptAI={promptAI} session={session} />
        <Toaster position="bottom-left" />
      </>
    );
  }
}
