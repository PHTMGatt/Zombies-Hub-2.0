import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainGuide from './pages/MainGuide';
import ApothiconUpgrade from './pages/ApothiconUpgrade';
import EggLocations from './pages/EggLocations';
import SummoningKey from './pages/SummoningKey';
import SoundStep from './pages/SoundStep';
import './global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header /> {/* ✅ Nav is already inside Header now */}

        <Routes>
          <Route path="/" element={<MainGuide />} />
          <Route path="/apothicon-upgrade" element={<ApothiconUpgrade />} />
          <Route path="/egg-locations" element={<EggLocations />} />
          <Route path="/summoning-key" element={<SummoningKey />} />
          <Route path="/sound-step" element={<SoundStep />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
