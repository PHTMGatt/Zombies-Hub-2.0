import React from 'react';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Home from '../src/pages/Home';
import Parts from '../src/pages/Parts';
import Wisp from '../src/pages/Wisp';
import BossFight from '../src/pages/BossFight';
import StepDetailsPage from '../src/pages/StepDetailsPage';
import Bows from '../src/pages/bows/Bows';
import BowLanding from '../src/pages/bows/BowLanding';
import BaseBow from '../src/pages/bows/BaseBow';
import ElectricBow from '../src/pages/bows/ElectricBow';
import FireBow from '../src/pages/bows/FireBow';
import WolfBow from '../src/pages/bows/WolfBow';
import VoidBow from '../src/pages/bows/VoidBow';
import '../src/styles/global.css';
import BackToStep from '../../../shared/guide/BackToStep';
import deGuideSteps from '../src/data/deGuideSteps';

export default function DerEisendracheRoutes() {
  return (
    <section className="map-module de-module">
      <Header />
      <div className="header-spacer" />
      <div className="de-page-shell">
        <BackToStep guidePath="/maps/der-eisendrache" steps={deGuideSteps} />
        <Routes>
          <Route index element={<Home />} />
          <Route path="parts" element={<Parts />} />
          <Route path="wisps" element={<Wisp />} />
          <Route path="boss" element={<BossFight />} />
          <Route path="step-details" element={<StepDetailsPage />} />
          <Route path="bows" element={<Bows />}>
            <Route index element={<BowLanding />} />
            <Route path="base" element={<BaseBow />} />
            <Route path="electric" element={<ElectricBow />} />
            <Route path="fire" element={<FireBow />} />
            <Route path="wolf" element={<WolfBow />} />
            <Route path="void" element={<VoidBow />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
