import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainGuide from './pages/MainGuide';
import Prerequisites from './pages/Prerequisites';
import RevealBlueprint from './pages/RevealBlueprint';
import Cogs from './pages/Cogs';
import Buildables from './pages/Buildables';
import ElevatorBattle from './pages/ElevatorBattle';
import Extras from './pages/Extras';

import CogOne from './components/CogSteps/CogOne';
import CogTwo from './components/CogSteps/CogTwo';
import CogThree from './components/CogSteps/CogThree';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainGuide />} />
      <Route path="/prerequisites" element={<Prerequisites />} />
      <Route path="/reveal-blueprint" element={<RevealBlueprint />} />
      <Route path="/cogs" element={<Cogs />} />
      <Route path="/cogs/1" element={<CogOne />} />
      <Route path="/cogs/2" element={<CogTwo />} />
      <Route path="/cogs/3" element={<CogThree />} />
      <Route path="/buildables" element={<Buildables />} />
      <Route path="/elevator-battle" element={<ElevatorBattle />} />
      <Route path="/extras" element={<Extras />} />
    </Routes>
  );
};

export default AppRouter;