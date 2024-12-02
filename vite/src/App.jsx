import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CurrentChat from './CurrentChat';
import ChatHistoryPage from './pages/ChatHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sidePanel/" element={<CurrentChat />} />
        <Route path="/sidePanel/index.html" element={<CurrentChat/>} />
        <Route path="/sidePanel/chat/:chatID" element={<ChatHistoryPage/>} />
        <Route path="*" element={<Navigate to="/sidePanel/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
