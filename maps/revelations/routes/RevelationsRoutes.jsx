import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import ApothiconUpgrade from '../src/pages/ApothiconUpgrade';
import EggLocations from '../src/pages/EggLocations';
import SummoningKey from '../src/pages/SummoningKey';
import SoundStep from '../src/pages/SoundStep';
import '../src/global.css';
import '../src/styles/GlassPolish.css';

export default function RevelationsRoutes() {
  return (
    <section className="map-module revelations-module">
      <Header />
      <Routes>
        <Route index element={<MainGuide />} />
        <Route path="apothicon-upgrade" element={<ApothiconUpgrade />} />
        <Route path="egg-locations" element={<EggLocations />} />
        <Route path="summoning-key" element={<SummoningKey />} />
        <Route path="sound-step" element={<SoundStep />} />
      </Routes>
      <Footer />
    </section>
  );
}
