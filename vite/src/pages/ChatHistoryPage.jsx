import '../sidePanel.css';

import React from 'react';
import { useParams } from 'react-router-dom';


function ChatHistoryPage() {
  const { chatID } = useParams();

  return (
    <div className='main-holder chat-open'>
      <h1>Chat History</h1>
      <p>Currently viewing chat with ID: {chatID}</p>
      {/* Fetch or display chat data using chatID */}
    </div>
  );
}

export default ChatHistoryPage;
