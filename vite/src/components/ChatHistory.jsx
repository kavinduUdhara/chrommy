import { BsThreeDots } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { WebsietsPopUp } from "./WebsitesPopUp";
import { loadChatList, getUniqueDomains } from "@/lib/chatHistoryDB";
import { useEffect, useState } from "react";
import ErrorWithOllie from "./ErrorWithOllie/ErrorWithOllie";

export default function ChatHistory({
  slideBarOpen,
  chatOpen,
  toogleSlideBar,
}) {
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
          )}
        </div>
      </div>
    </div>
  );
}
