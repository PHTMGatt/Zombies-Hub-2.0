import React from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
// OG restore (2026-11-22): the original Revelations-Guide pages, header and footer, copied from
// github.com/PHTMGatt/Revelations-Guide (0fba8d0) into maps/revelations/og and adapted only for hub routes and asset paths.
import Header from '../og/components/Header';
import Footer from '../og/components/Footer';
import MainGuide from '../og/pages/MainGuide';
import ApothiconUpgrade from '../og/pages/ApothiconUpgrade';
import EggLocations from '../og/pages/EggLocations';
import SummoningKey from '../og/pages/SummoningKey';
import SoundStep from '../og/pages/SoundStep';
import '../og/global.css';
// OG has no Step Details page: the old address goes to the main guide (data stays in src/, unrouted, for the content baseline).


export default function RevelationsRoutes() {
  return (
    <section className="map-module revelations-module">
      <div className="app">
        <Header />
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="apothicon-upgrade" element={<ApothiconUpgrade />} />
          <Route path="egg-locations" element={<EggLocations />} />
          <Route path="summoning-key" element={<SummoningKey />} />
          <Route path="sound-step" element={<SoundStep />} />
          <Route path="step-details" element={<Navigate to="/maps/revelations" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </section>
  );
}
