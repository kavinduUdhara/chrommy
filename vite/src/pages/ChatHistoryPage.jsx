import "../sidePanel.css";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TopTitleBar from "@/components/TopTitleBar";
import ChatHistory from "@/components/ChatHistory";
import ChatBoxList from "@/components/ChatBoxList";

function ChatHistoryPage() {
  const { chatID } = useParams();
  const [loading, setLoading] = useState(true);
  const [slideBarOpen, setSlideBarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [AIError, setAIError] = useState(null);

  const toogleSlideBar = () => {
    setSlideBarOpen(!slideBarOpen);
  };

  if (loading) {
    return (
      <div className="main-holder chat-open">
        <div className="page-info-holder">
          <div className="page-info">
            <div className="top-title-bar" data-chatOpen={true}>
              <div className="left">
                <div className="def-loading-box w-7 h-7 bg-slate-100"></div>
                <div className="info">
                  <div className="title def-loading-box w-32 h-5 bg-slate-100"></div>
                  <div className="tab def-loading-box min-w-10 h-3"></div>
                </div>
              </div>
              <div className="right">
                <div className="ac-btns">
                  <button className="def-loading-box w-7 h-7 bg-sky-100"></button>
                  <button className="def-loading-box w-7 h-7 bg-sky-100"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-box-list-holder">
          <div className="loading-chat-data mt-5 flex flex-col">
            <div className="flex items-center gap-2 shadow-md p-1 px-2 rounded-full w-fit self-center">
              <AiOutlineLoading3Quarters className="def-loading-svg" />
              Loading Chat Data
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="main-holder chat-open">
      <div className="page-info-holder" data-chatOpen={true}>
        <div className="page-info">
          <TopTitleBar
            chatOpen={true}
            slideBarOpen={slideBarOpen}
            tabURL="tabURL"
            toogleSlideBar={toogleSlideBar}
          />
        </div>
      </div>
      <ChatHistory
        slideBarOpen={slideBarOpen}
        chatOpen={true}
        toogleSlideBar={toogleSlideBar}
      />
      <ChatBoxList
        currentChat={currentChat}
        AIError={AIError}
        chatOpen={true}
        textBoxActive={false}
        ongoingChat={false}
      />
    </div>
  );
}

export default ChatHistoryPage;
