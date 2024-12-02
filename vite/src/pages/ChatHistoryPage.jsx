import "../sidePanel.css";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete, MdOutlineDeleteSweep } from "react-icons/md";
import { TbHome2 } from "react-icons/tb";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopTitleBar from "@/components/TopTitleBar";
import ChatHistory from "@/components/ChatHistory";
import ChatBoxList from "@/components/ChatBoxList";
import { getChatByID } from "@/lib/chatHistoryDB"; // Import the function
import { parseHtml } from "@/AppFunctions";
import ErrorWithOllie from "@/components/ErrorWithOllie/ErrorWithOllie";
import { AlertDialogHolder } from "@/components/Alert";
import { deleteChatByID } from "@/lib/chatHistoryDB";
import toast from "react-hot-toast";

function ChatHistoryPage() {
  const navigate = useNavigate();

  const { chatID } = useParams();
  const [loading, setLoading] = useState(true);
  const [slideBarOpen, setSlideBarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [AIError, setAIError] = useState({
    error: false,
    message: "",
    id: null,
  });
  const [currrentChatID, setCurrentChatID] = useState(null);
  const [chatNotFound, setChatNotFound] = useState(false); // To track if chat is not found
  const [domain, setDomain] = useState("");

  const toogleSlideBar = () => {
    setSlideBarOpen(!slideBarOpen);
  };

  const goBack = () => {
    navigate(-1); // Navigate to the previous page in the history stack
  };

  const goHomeFullReload = () => {
    toogleSlideBar();
    navigate("/idePanel/");
    // window.location.href = "/sidePanel/";
  };

  const handleDeleteAll = async () => {
    const loadingToast = toast.loading("Deleting all chats...");
    try {
      await deleteChatByID(currrentChatID);
      toast.success("All chats have been deleted.", { id: loadingToast });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats.", { id: loadingToast });
    } finally {
      goHomeFullReload();
    }
  };

  // Fetch chat data by ID when the component mounts
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chat = await getChatByID(chatID);

        // Process the chatData to include 'preview'
        const processedChatData = await Promise.all(
          chat.chatData.map(async (item) => ({
            ...item,
            preview: await parseHtml(item.text),
          }))
        );

        setCurrentChat(processedChatData); // Set processed chat data to state
        setAIError(chat.error);
        setCurrentChatID(chat.id);
        setDomain(chat.domain);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setLoading(false);
        setChatNotFound(true); // Set flag to show error message
      }
    };

    fetchChatData();
  }, [chatID]);

  if (loading) {
    return (
      <div className="main-holder chat-open">
        <div className="max-w-xl w-full p-3">
          <button className="def-back-btn self-start" onClick={goBack}>
            <IoIosArrowBack />
          </button>
          <div className="chat-box-list-holder">
            <ErrorWithOllie
              loading={true}
              loadingTitle="Loading Chat Data"
            ></ErrorWithOllie>
          </div>
        </div>
      </div>
    );
  }

  if (chatNotFound) {
    return (
      <div className="main-holder chat-open">
        <div className="max-w-xl w-full p-3">
          <button className="def-back-btn self-start" onClick={goBack}>
            <IoIosArrowBack />
          </button>
          <div className="chat-box-list-holder">
            <ErrorWithOllie
              customeButtonTitle={"Go Back"}
              cuttomeButtonAction={goBack}
            >
              Sorry, the chat with ID {chatID} does not exist. Please check the
              ID or contact support if this is an issue.
            </ErrorWithOllie>
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
            tabURL={domain}
            toogleSlideBar={toogleSlideBar}
          />
        </div>
      </div>
      <ChatHistory
        slideBarOpen={slideBarOpen}
        chatOpen={true}
        toogleSlideBar={toogleSlideBar}
        chatData={currentChat}
      />
      <ChatBoxList
        currentChat={currentChat}
        AIError={AIError}
        chatOpen={true}
        textBoxActive={false}
        ongoingChat={false}
      />
      <div className="def-abs-btn-list">
        <button
          className="def-abs-btn primary"
          aria-label="start a new chat"
          onClick={goHomeFullReload}
        >
          <TbEdit /> New Chat
        </button>
        <AlertDialogHolder
          title="Are you sure you want to delete this chat?"
          descrition="This will permanently delete this chat record. Once deleted, it cannot be recovered. Are you sure you want to DELETE?"
          Dangirous={true}
          confirmBtnTitle="Delete"
          onConfirm={handleDeleteAll}
        >
          <button
            className="def-abs-btn del"
            aria-label="Delete this chat"
          >
            <MdOutlineDelete />
          </button>
        </AlertDialogHolder>
        <button
          className="def-abs-btn"
          onClick={goHomeFullReload}
          aria-label="Go to home page"
        >
          <TbHome2 />
        </button>
      </div>
    </div>
  );
}

export default ChatHistoryPage;
