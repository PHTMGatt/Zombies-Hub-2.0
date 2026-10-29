import React from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import ApothiconUpgrade from '../src/pages/ApothiconUpgrade';
import EggLocations from '../src/pages/EggLocations';
import SummoningKey from '../src/pages/SummoningKey';
import SoundStep from '../src/pages/SoundStep';
import '../src/global.css';

export default function RevelationsRoutes() {
  return (
    <section className="map-module revelations-module">
      <Header />
      {/* One cinematic backdrop shared by every section, so pages only render their own content. */}
      <div className="rev-stage">
        <div className="rev-backdrop" aria-hidden="true" />
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="apothicon-upgrade" element={<ApothiconUpgrade />} />
          <Route path="egg-locations" element={<EggLocations />} />
          <Route path="summoning-key" element={<SummoningKey />} />
          <Route path="sound-step" element={<SoundStep />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
