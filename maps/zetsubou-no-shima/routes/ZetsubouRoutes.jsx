import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainGuide from '../src/pages/MainGuide';
import Prerequisites from '../src/pages/Prerequisites';
import RevealBlueprint from '../src/pages/RevealBlueprint';
import Cogs from '../src/pages/Cogs';
import Buildables from '../src/pages/Buildables';
import ElevatorBattle from '../src/pages/ElevatorBattle';
import Extras from '../src/pages/Extras';
import CogOne from '../src/components/CogSteps/CogOne';
import CogTwo from '../src/components/CogSteps/CogTwo';
import CogThree from '../src/components/CogSteps/CogThree';
import '../src/styles/Global.css';

export default function ZetsubouRoutes() {
  return (
    <section className="map-module zets-module">
      <Routes>
        <Route index element={<MainGuide />} />
        <Route path="prerequisites" element={<Prerequisites />} />
        <Route path="reveal-blueprint" element={<RevealBlueprint />} />
        <Route path="cogs" element={<Cogs />} />
        <Route path="cogs/1" element={<CogOne />} />
        <Route path="cogs/2" element={<CogTwo />} />
        <Route path="cogs/3" element={<CogThree />} />
        <Route path="buildables" element={<Buildables />} />
        <Route path="elevator-battle" element={<ElevatorBattle />} />
        <Route path="extras" element={<Extras />} />
      </Routes>
    </section>
  );
}
