import React, { Suspense, lazy } from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import ApothiconUpgrade from '../src/pages/ApothiconUpgrade';
import EggLocations from '../src/pages/EggLocations';
import SummoningKey from '../src/pages/SummoningKey';
import SoundStep from '../src/pages/SoundStep';
import StepDetailsPage from '../src/pages/StepDetailsPage';
import '../src/global.css';
import BackToStep from '../../../shared/guide/BackToStep';
import revGuideSteps from '../src/data/revGuideSteps';
import useDesign from '../../../shared/sys/useDesign';

// Candidate page systems, preview only (?design=a|b|c). Loaded on demand so the live pages pay nothing.
const RevSys = lazy(() => import('../src/sys/RevSys'));

export default function RevelationsRoutes() {
  const design = useDesign();
  if (design) return <Suspense fallback={null}><RevSys design={design} /></Suspense>;
  return (
    <section className="map-module revelations-module">
      <Header />
      {/* One cinematic backdrop shared by every section, so pages only render their own content. */}
      <div className="rev-stage">
        <div className="rev-backdrop" aria-hidden="true" />
        <BackToStep guidePath="/maps/revelations" steps={revGuideSteps} />
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="apothicon-upgrade" element={<ApothiconUpgrade />} />
          <Route path="egg-locations" element={<EggLocations />} />
          <Route path="summoning-key" element={<SummoningKey />} />
          <Route path="sound-step" element={<SoundStep />} />
          <Route path="step-details" element={<StepDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
