import { BsThreeDots } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { WebsietsPopUp } from "./WebsitesPopUp";
import { loadChatList } from "@/lib/chatHistoryDB";
import { useEffect, useState } from "react";
import ErrorWithOllie from "./ErrorWithOllie/ErrorWithOllie";

export default function ChatHistory({ slideBarOpen, chatOpen, toogleSlideBar }) {
  const [chatList, setChatList] = useState([]);

  // Load chat data from IndexedDB
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const chats = await loadChatList();
        setChatList(chats); // Update the state with chat data
      } catch (error) {
        console.error("Failed to load chat list:", error);
      }
    };
    fetchChatList();
  }, [slideBarOpen]);

  return (
    <div className="chat-history-holder" data-slideBarOpen={slideBarOpen} data-chatOpen={chatOpen} data-slideBarChatOpen={slideBarOpen && !chatOpen}>
      <div className="chat-history">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <IoSearchOutline />
            <input type="text" placeholder="Search" />
          </div>
          <WebsietsPopUp />
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {chatList.length > 0 ? (
            chatList.map(({ id, title, domain, modifiedAt }) => (
              <button key={id} className="list">
                <div className="info">
                  <div className="title">{title}</div>
                  <div className="more-info">
                    <div className="domain">{domain}</div>
                    <div className="date">
                      {new Date(modifiedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="ac-btns">
                  <button>
                    <BsThreeDots />
                  </button>
                </div>
              </button>
            ))
          ) : (
            <div className="w-full">

              <ErrorWithOllie title={"No items found"} customeButtonTitle="Close chat history" cuttomeButtonAction={toogleSlideBar}>Chat history will appear here</ErrorWithOllie>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
