/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./sidePanel.css";

import { TbSend2 } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { PiArrowDownRightBold } from "react-icons/pi";
import { CgMenuLeftAlt } from "react-icons/cg";

import ChatBoxList from "./components/ChatBoxList";
import TopTitleBar from "./components/TopTitleBar";
import {
  loadTheActiveTabInfo,
  checkFaviconBrightness,
  getGreeting,
  getUniqueID,
  getWebsiteContent,
  parseHtml,
} from "./AppFunctions";
import useAutoResizeTextBox from "./hook/useAutoResizeTextBox";
import GeminiSVG from "./components/Gemini";

import {
  createNewChat,
  updateChatByID,
  updateErrorByID,
} from "./lib/chatHistoryDB";
import ChatHistory from "./components/ChatHistory";

export default function ChatPreview({ promptAI, session }) {
  const textareaRef = useRef(null);
  useAutoResizeTextBox(textareaRef);

  const [tabInfo, setTabInfo] = useState({
    tab: "",
    domain: "",
    favicon: "",
    isFaviconBright: false,
  });
  const [tabInfoLoaing, setTabInfoLoading] = useState(true);
  const [textBox, setTextBox] = useState({
    text: "",
    cmds: null,
    context: "",
    placeholder: "Tell me more about...",
  });
  const [textBoxActive, setTextBoxActive] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPreAnimation, setChatPreAnimation] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [AIError, setAIError] = useState({
    error: false,
    message: "",
    id: null,
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [slideBarOpen, setSlideBarOpen] = useState(false);

  //load the activeTab info
  useEffect(() => {
    const fetchTabInfo = async () => {
      try {
        const tabInfo = await loadTheActiveTabInfo();
        setTabInfo(tabInfo);
        setTabInfoLoading(false);
        if (tabInfo.favicon) {
          const isFaviconBright = await checkFaviconBrightness(tabInfo.favicon);
          setTabInfo((prevTabInfo) => ({ ...prevTabInfo, isFaviconBright }));
        }
      } catch (error) {
        console.error("Error loading tab info:", error);
        setTabInfoLoading(false);
      }
    };

    fetchTabInfo();
  }, []);

  useEffect(() => {
    if (!chatPreAnimation) {
      if (currentChat.length > 0) {
        ChatOpenManual();
      }
    }
  }, [currentChat]);

  useEffect(() => {
    const updateChat = async () => {
      if (currentChat.length > 0) {
        if (!currentChatId) {
          console.log("making new id");
          const chatID = getUniqueID();
          setCurrentChatId(chatID);
          await createNewChat({
            domain: tabInfo.domain || "null",
            title: getTitle(currentChat, tabInfo),
            id: chatID,
          });
        } else {
          await updateChatByID(currentChatId, currentChat);
          if (AIError) {
            await updateErrorByID(currentChatId, AIError);
          }
        }
      }
    };

    // Call the async function
    if (!tabInfoLoaing) {
      updateChat();
    }
  }, [currentChat, currentChatId, tabInfoLoaing, AIError]);

  const getTitle = (currentChat, tabInfo) => {
    if (currentChat?.[0]?.text) {
      // If text is present, get the first 25 characters and it it's over 25 add ... at the end
      return currentChat[0].text.length > 25
        ? currentChat[0].text.slice(0, 25) + "..."
        : currentChat[0].text
    } else if (currentChat?.[0]?.cmds?.includes("Summarize Tab")) {
      // If cmds array includes 'summarizeTab', create the title using domain
      return `Summarize ${tabInfo?.domain || "null"}`;
    }
    // Default case if none of the conditions are met
    return `Untitled @${tabInfo?.domain || "null"}`;
  };

  const handleSummarizeButton = () => {
    setTextBox({
      ...textBox,
      cmds: ["Summarize Tab"],
      context: tabInfo.tab,
      placeholder: "Give me top 3 takeaways from...",
    });
  };

  const ChatOpenManual = () => {
    setChatPreAnimation(true);
    setTimeout(() => {
      setChatOpen(!chatOpen);
    }, 600);
  };

  const handelCancelContextBtn = () => {
    setTextBox({
      ...textBox,
      cmds: null,
      context: "",
      placeholder: "Tell me more about...",
    });
  };

  const toogleSlideBar = () => {
    setSlideBarOpen(!slideBarOpen);
  };

  useEffect(() => {
    console.log("currentChat", currentChat);
  }, [currentChat]);
  const handelSubmitButton = async () => {
    if (!textBox.text && !textBox.cmds) return;
    if (!textBoxActive) return;

    setTextBoxActive(false);

    // Add user's message to the chat
    const userMessage = {
      text: textBox.text,
      preview: await parseHtml(textBox.text),
      context: textBox.context,
      cmds: textBox.cmds,
      time: new Date().toISOString(),
      user: true,
      id: getUniqueID(),
    };

    let userMessageText = userMessage.text;

    setCurrentChat((prevChat) => [...prevChat, userMessage]);

    if (userMessage.cmds && userMessage.cmds.includes("Summarize Tab")) {
      let webContent = await getWebsiteContent();
      //append this web content part into usermessage.text (to the bottom)
      //convert webContent object into a string:
      userMessageText += `\n\nsummarize following website content\n \n${webContent}`;
    }

    // Clear the input box
    setTextBox({
      text: "",
      cmds: null,
      context: "",
      placeholder: "Tell me more about...",
    });
    console.log(currentChat);

    // Add a placeholder for the AI's response
    const aiMessageId = getUniqueID();
    const aiMessagePlaceholder = {
      text: "",
      preview: "",
      context: "",
      cmds: null,
      time: new Date().toISOString(),
      user: false,
      id: aiMessageId,
    };
    setCurrentChat((prevChat) => [...prevChat, aiMessagePlaceholder]);

    // Handle streaming response
    try {
      await promptAI(session, userMessageText, async (chunk) => {
        // Optimistic UI update (partial updates)
        const chunkPreview = await parseHtml(chunk);
        console.log(currentChat);
        setCurrentChat((prevChat) =>
          prevChat.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: chunk,
                  preview: chunkPreview,
                }
              : msg
          )
        );
      });

      console.log("Streaming completed.");
      setTextBoxActive(true);
    } catch (error) {
      console.error("Error during streaming response:", error);
      setAIError({ error: true, message: error.message, id: aiMessageId });
    }
  };

  return (
    <>
      <div className="left-menu-holder" data-chatOpen={chatOpen}>
        <div className="left-menu">
          <button onClick={toogleSlideBar} data-slideBarOpen={slideBarOpen}>
            <CgMenuLeftAlt />
          </button>
          <div className="gemini-logo">
            <p className="def-nano-logo-txt">Gemini Nano</p>
          </div>
        </div>
      </div>
      <div className={`main-holder ${chatPreAnimation ? "chat-open" : ""}`}>
        <div className="greeting-holder" data-chatOpen={chatOpen}>
          <img src="./img/light-bulb.png" className="img-light" />
          <img src="./img/chair.png" className="img-chair" />
          <div className="text">
            <h1 className="greeting">{getGreeting()}</h1>
            <p>Welcome to chrommy</p>
          </div>
        </div>
        <div className="page-info-holder" data-chatOpen={chatOpen}>
          {Object.keys(tabInfo).length === 0 ? (
            <div className="page-info">
              <div className="def-loading-box w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="flex flex-col">
                <p
                  id="tab-title"
                  className="def-loading-box w-20 h-5 bg-slate-200"
                ></p>
                <p
                  id="tab-url"
                  className="def-loading-box w-10 h-3 bg-slate-200"
                ></p>
              </div>
            </div>
          ) : (
            <div className="page-info">
              <div className="info" data-chatOpen={chatPreAnimation}>
                <img
                  id="fav-icon"
                  src={tabInfo.favicon || "../assets/icon-32.png"}
                  alt="Favicon"
                  className={`fav-icon ${
                    tabInfo.isFaviconBright ? "dark" : ""
                  }`}
                />
                <div className="more-info">
                  <p id="tab-title">{tabInfo.tab}</p>
                  <p id="tab-url">{tabInfo.domain}</p>
                </div>
              </div>
              <TopTitleBar
                chatOpen={chatPreAnimation}
                tabURL={tabInfo.domain}
                slideBarOpen={slideBarOpen}
                toogleSlideBar={toogleSlideBar}
              />
            </div>
          )}
          <button
            className="ac-btn"
            onClick={handleSummarizeButton}
            disabled={
              tabInfo.domain === "www.youtube.com" ||
              !tabInfo.domain ||
              tabInfo.domain === "null"
            }
          >
            Summarize
            <PiArrowDownRightBold />
          </button>
        </div>
        <ChatHistory slideBarOpen={slideBarOpen} chatOpen={chatOpen} toogleSlideBar={toogleSlideBar}/>
        <ChatBoxList
          currentChat={currentChat}
          AIError={AIError}
          chatOpen={chatOpen}
          textBoxActive={textBoxActive}
          ongoingChat={true}
        />
        <div className="chat-box-send-holder">
          {(textBox.context || textBox.cmds) && (
            <div class="context">
              <div class="text">
                {textBox.cmds &&
                  textBox.cmds.length > 0 &&
                  textBox.cmds.map((cmd) => (
                    <span class="cmd">{cmd}</span>
                  ))}{" "}
                {textBox.context}
              </div>
              <button className="cancel-btn" onClick={handelCancelContextBtn}>
                <RxCross2 />
              </button>
            </div>
          )}
          <div className="chat-box-send">
            <textarea
              id="chat-input"
              ref={textareaRef}
              disabled={!textBoxActive}
              rows="1"
              placeholder={textBox.placeholder}
              value={textBox.text}
              onChange={(e) => setTextBox({ ...textBox, text: e.target.value })}
            ></textarea>
            <button
              id="send-btn"
              onClick={handelSubmitButton}
              disabled={!textBoxActive}
            >
              <TbSend2 />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
