// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import MainGuide from "./Pages/MainGuide";
import FireStaff from "./Pages/FireStaff";
import IceStaff from "./Pages/IceStaff";
import WindStaff from "./Pages/WindStaff";
import LightningStaff from "./Pages/LightningStaff";

// Global Styles
import "./Styles/global.css";

function App() {
  return (
    <div className="layout-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainGuide />} />
          <Route path="/FireStaff" element={<FireStaff />} />
          <Route path="/IceStaff" element={<IceStaff />} />
          <Route path="/WindStaff" element={<WindStaff />} />
          <Route path="/LightningStaff" element={<LightningStaff />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
