import { BsThreeDots } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { TbHome2 } from "react-icons/tb";

import { WebsietsPopUp } from "./WebsitesPopUp";
import { loadChatList, getUniqueDomains } from "@/lib/chatHistoryDB";
import { useEffect, useState } from "react";
import ErrorWithOllie from "./ErrorWithOllie/ErrorWithOllie";
import { useNavigate } from "react-router-dom";

import { AlertDialogHolder } from "./Alert";
import { deleteAllChats } from "@/lib/chatHistoryDB";
import toast from "react-hot-toast";

export default function ChatHistory({
  slideBarOpen,
  chatOpen,
  toogleSlideBar,
}) {
  const navigate = useNavigate();

  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");

  // Load chat data from IndexedDB
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chats = await loadChatList();
        setChatList(chats); // Update the state with chat data
        const uniqueDomains = await getUniqueDomains();
        setDomains(uniqueDomains); // Load unique domains
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    fetchChatData();
  }, [slideBarOpen]);

  // Filter chat list based on search query and selected domain
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredChatList(
      chatList.filter(
        ({ title, domain, modifiedAt }) =>
          (title.toLowerCase().includes(query) ||
            new Date(modifiedAt)
              .toLocaleString()
              .toLowerCase()
              .includes(query)) &&
          (selectedDomain === "" || domain === selectedDomain)
      )
    );
  }, [searchQuery, chatList, selectedDomain]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("");
  };

  const redirectToChat = (chatID) => {
    navigate(`/sidePanel/chat/${chatID}`);
    toogleSlideBar();
  };

  const goHomeFullReload = () => {
    toogleSlideBar();
    navigate("/idePanel/");
    // window.location.href = "/sidePanel/";
  }

  const handleDeleteAll = async () => {
    const loadingToast = toast.loading("Deleting all chats...");
    try {
      await deleteAllChats();
      toast.success("All chats have been deleted.", { id: loadingToast });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats.", { id: loadingToast });
    } finally {
      toogleSlideBar();
    }
  };

  return (
    <div
      className="chat-history-holder"
      data-slideBarOpen={slideBarOpen}
      data-chatOpen={chatOpen}
      data-slideBarChatOpen={slideBarOpen && !chatOpen}
    >
      <div className="chat-history">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <WebsietsPopUp
            domains={domains}
            selectedDomain={selectedDomain}
            onSelectDomain={setSelectedDomain} // Pass domain selection handler
          />
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {chatList.length === 0 ? ( // Check if there are no records in the database
            <div className="max-w-md w-full self-center">
              <ErrorWithOllie
                title={"Chat Hub"}
                customeButtonTitle="Close Chat Hub"
                cuttomeButtonAction={toogleSlideBar}
              >
                Your conversations will live here.
              </ErrorWithOllie>
            </div>
          ) : filteredChatList.length === 0 ? ( // Check if no records match the filters
            <div className="max-w-md w-full self-center">
              <ErrorWithOllie
                title={"No items found"}
                clearFilter={true}
                clearFilterAction={clearFilters}
              >
                Oops, we couldn't find what you're looking for—try clearing the
                filters!
              </ErrorWithOllie>
            </div>
          ) : (
            filteredChatList.map(({ id, title, domain, modifiedAt }) => (
              <button
                key={id}
                className="list"
                onClick={() => redirectToChat(id)}
              >
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
          )}
        </div>
        <div className="def-abs-btn-list">
          <button className="def-abs-btn primary" aria-label="start a new chat" onClick={goHomeFullReload}>
            <TbEdit /> New Chat
          </button>
          <AlertDialogHolder
            title="Are you sure you want to delete all records?"
            descrition="This will permanently delete all your chat records. Once deleted, they cannot be recovered. Are you sure you want to DELETE ALL CHATS?"
            Dangirous={true}
            confirmBtnTitle="Delete All Records"
            onConfirm={handleDeleteAll}
          >
            <button className="def-abs-btn del" aria-label="Delete all chat record">
              <MdOutlineDeleteSweep />
            </button>
          </AlertDialogHolder>
          <button className="def-abs-btn" onClick={goHomeFullReload} aria-label="Go to home page">
            <TbHome2 />
          </button>
        </div>
      </div>
    </div>
  );
}
