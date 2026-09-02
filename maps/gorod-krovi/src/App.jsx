import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import MainGuide from './pages/MainGuide';
import TrophyChallenges from './pages/TrophyChallenges';
import ValveSolver from './pages/ValveSolver';
import BossFight from './pages/BossFight';
import Buildables from './pages/Buildables';

import './styles/Global.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainGuide />} />
            <Route path="/trophies" element={<TrophyChallenges />} />
            <Route path="/valves" element={<ValveSolver />} />
            <Route path="/boss" element={<BossFight />} />
            <Route path="/buildables" element={<Buildables />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
