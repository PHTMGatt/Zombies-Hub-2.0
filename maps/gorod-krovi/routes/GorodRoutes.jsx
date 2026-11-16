import React from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import TrophyChallenges from '../src/pages/TrophyChallenges';
import ValveSolver from '../src/pages/ValveSolver';
import BossFight from '../src/pages/BossFight';
import Buildables from '../src/pages/Buildables';
import StepDetailsPage from '../src/pages/StepDetailsPage';
import '../src/styles/Global.css';
import BackToStep from '../../../shared/guide/BackToStep';
import gorodGuideSteps from '../src/data/gorodGuideSteps';

export default function GorodRoutes() {
  return (
    <section className="map-module gorod-module">
      <Header />
      <div className="gorod-content">
        <BackToStep guidePath="/maps/gorod-krovi" steps={gorodGuideSteps} />
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="trophies" element={<TrophyChallenges />} />
          <Route path="valves" element={<ValveSolver />} />
          <Route path="boss" element={<BossFight />} />
          <Route path="buildables" element={<Buildables />} />
          <Route path="step-details" element={<StepDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
