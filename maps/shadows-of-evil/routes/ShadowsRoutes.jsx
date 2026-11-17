import React from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import StepDetailsPage from '../src/pages/StepDetailsPage';
import Tabs from '../src/components/Tabs';
import BackToStep from '../../../shared/guide/BackToStep';
import soeGuideSteps from '../src/data/soeGuideSteps';
import '../src/styles/Shadows.css';

export default function ShadowsRoutes() {
  return (
    <section className="map-module shadows-module">
      <Header />
      <Tabs />
      <BackToStep guidePath="/maps/shadows-of-evil" steps={soeGuideSteps} />
      <Routes>
        <Route index element={<MainGuide />} />
        <Route path="step-details" element={<StepDetailsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </section>
  );
}
