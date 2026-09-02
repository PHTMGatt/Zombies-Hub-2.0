import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import TrophyChallenges from '../src/pages/TrophyChallenges';
import ValveSolver from '../src/pages/ValveSolver';
import BossFight from '../src/pages/BossFight';
import Buildables from '../src/pages/Buildables';
import '../src/styles/Global.css';

export default function GorodRoutes() {
  return (
    <section className="map-module gorod-module">
      <Header />
      <main>
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="trophies" element={<TrophyChallenges />} />
          <Route path="valves" element={<ValveSolver />} />
          <Route path="boss" element={<BossFight />} />
          <Route path="buildables" element={<Buildables />} />
        </Routes>
      </main>
      <Footer />
    </section>
  );
}
