import "./assets/ChatError.css";
import { FaGithub } from "react-icons/fa6";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorOptions } from "./components/ErrorOptions";
import { AlertRedirectToGitHub } from "./components/AlertRedirectToGItHub";

import { useEffect, useState } from "react";
import ChatPreview from "./ChatPreview";
import { createAiSession, promptAI } from "./hook/useSession";
import { Toaster } from "react-hot-toast";

import { getPreferenceByID } from "./lib/chatHistoryDB";

const loadPreferences = async () => {
  const existingPreferences = await getPreferenceByID("userInfo");
  if (existingPreferences) {
    return existingPreferences.data;
  } else
    return {
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
        setError(error);
      }
    }
    init();
  }, []);
  if (error) {
    return (
      <div className="error-page-holder">
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="top-bar-logo">
              <img src="./img/logo.png" />
            </div>
            <div className="info">
              <div className="top-bar-title">Chrommy</div>
              <div className="gemini-logo">
                <p>Gemini Nano</p>
              </div>
            </div>
          </div>
          <div className="top-bar-right">
            <AlertRedirectToGitHub>
              <button className="ac-btn">
                <FaGithub />
                <div className="sr-only">Github</div>
              </button>
            </AlertRedirectToGitHub>
          </div>
        </div>
        <div className="pg-content">
          <div className="error-holder">
            <div className="bg-img-holder">
              {/* <img src="./img/light-bulb.png" className="img-light" /> */}
              <img src="./img/chair.png" className="img-chair" />
              <img src="./img/apple-1.png" className="img-apple" />
            </div>
            <div className="error-box">
              <div className="banner">Error</div>
              <div className="error-title">
                <Alert className="bg-red-50">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>
                    {error.title || "Something went wrong"}
                  </AlertTitle>
                  <AlertDescription>
                    {error.message || "An unknown error occurred."}
                  </AlertDescription>
                </Alert>
              </div>
              <div className="error-more-info">
                <ErrorOptions
                  errorMsg={error.message}
                  errorTitle={error.title}
                  errorStatus={error.status ? error.status : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
