// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CurrentChat from './CurrentChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sidePanel/" element={<CurrentChat />} />
        <Route path="/sidePanel/index.html" element={<CurrentChat/>} />
      </Routes>
    </Router>
  );
}

export default App;
