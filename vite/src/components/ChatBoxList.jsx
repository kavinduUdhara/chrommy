import { BiMessageSquareEdit } from "react-icons/bi";
import { GoBug } from "react-icons/go";

import GeminiSVG from "./Gemini";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ChatBoxList({
  currentChat,
  chatOpen,
  textBoxActive,
  AIError,
  ongoingChat = true,
  responseLoadig = false,
}) {
  const navigate = useNavigate();

  const onStartNewChat = () => {
    console.log("Starting a new chat");
    navigate("/sidePanel/index.html", { replace: true });
    window.location.reload();
  };

  const openReportPage = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfS1cVG_qx-5WD8yM_hfL76ISL_okAQAnLgXUB4RFmJ79FrvA/viewform",
      "_blank",
      "noopener,noreferrer"
    );
  };

  useEffect(() => {
    console.log(AIError);
    console.log(currentChat);
  }, [AIError, currentChat]);
  return (
    <div class="chat-box-list-holder" data-chatOpen={chatOpen}>
      {currentChat.length > 0 &&
        currentChat.map((chat) => (
          <div
            key={chat.id}
            className={`chat-box-holder ${chat.user ? "user" : "system"}`}
          >
            {!chat.user && (
              <div className="profile">
                <GeminiSVG />
              </div>
            )}
            {AIError.error && chat.id === AIError.id ? (
              <div className="chat system error">
                <div className="text">{AIError.message}</div>
                {ongoingChat && (
                  <div className="action-btns">
                    <button onClick={openReportPage}>
                      <GoBug /> Report
                    </button>
                    <button data-primary={true} onClick={onStartNewChat}>
                      <BiMessageSquareEdit /> New Chat
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`chat ${chat.user ? "user" : "system"}`}>
                {(chat.context || chat.cmds) && (
                  <div class="context">
                    {chat.cmds &&
                      chat.cmds.length > 0 &&
                      chat.cmds.map((cmd) => (
                        <span class="cmd">{cmd}</span>
                      ))}{" "}
                    {chat.context}
                  </div>
                )}
                {chat.text && (
                  <div class="text">{chat.user ? chat.text : (chat.preview !== "" ? chat.preview : (<div className="def-loading-box">Thinking</div>))}</div>
                )}
              </div>
            )}
          </div>
        ))}
      {currentChat.length > 0 && textBoxActive && (
        <div className="start-a-new-chat">
          <div className="hr"></div>
          <button onClick={onStartNewChat} aria-label="start a new chat">
            <GeminiSVG />
            <p className="def-nano-logo-txt"> start a new chat</p>
          </button>
        </div>
      )}
    </div>
  );
}
