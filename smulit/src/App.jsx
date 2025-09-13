import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/chat";
import './tailwind.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
