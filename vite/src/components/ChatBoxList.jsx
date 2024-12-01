import { BiMessageSquareEdit } from "react-icons/bi";
import { GoBug } from "react-icons/go";

import GeminiSVG from "./Gemini";

export default function ChatBoxList({ currentChat, chatOpen, textBoxActive, AIError, ongoingChat=true }) {
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
                    <button>
                      <GoBug /> Report
                    </button>
                    <button data-primary={true}>
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
                  <div class="text">{chat.user ? chat.text : chat.preview}</div>
                )}
              </div>
            )}
          </div>
        ))}
      {currentChat.length > 0 && textBoxActive && (
        <div className="start-a-new-chat">
          <div className="hr"></div>
          <button>
            <GeminiSVG />
            <p className="def-nano-logo-txt"> start a new chat</p>
          </button>
        </div>
      )}
    </div>
  );
}