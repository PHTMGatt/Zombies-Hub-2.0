// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import MobMain from './pages/MobMain';
import FreeBlundergat from './pages/FreeBlundergat';
import Spoon from './pages/Spoon';
import Redeemer from './pages/Redeemer';
import Logs from './pages/Logs';
import FinalStep from './pages/FinalStep';
import NotFound from './pages/NotFound';

const App = () => (
  <div className="app-container">
    {/* Full-page blurred background layer */}
    <div className="bg-blur" />
    <div className="bg-tint" />

    <Router>
      <Header />
      <main className="app-main">
        {/* Note: Nav removed here, it’s rendered inside Header */}
        <Routes>
          <Route path="/" element={<MobMain />} />
          <Route path="/free-blundergat" element={<FreeBlundergat />} />
          <Route path="/spoon" element={<Spoon />} />
          <Route path="/redeemer" element={<Redeemer />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/final-step" element={<FinalStep />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </div>
);

export default App;
