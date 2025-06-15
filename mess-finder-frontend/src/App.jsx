// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MessList from "./pages/MessList";
import MessDetail from "./pages/MessDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messes" element={<MessList />} />
        <Route path="/messes/:id" element={<MessDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
