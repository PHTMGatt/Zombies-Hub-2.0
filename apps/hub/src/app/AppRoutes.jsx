import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import AllMaps from '../pages/AllMaps';
import EasterEggs from '../pages/EasterEggs';
import EasterEggGuide from '../pages/EasterEggGuide';
import MapDetails from '../pages/MapDetails';
import MapInfo from '../pages/MapInfo';
import SideEasterEggList from '../pages/SideEasterEggList';
import SideEEInfo from '../pages/SideEEInfo';
import ComingSoon from '../pages/ComingSoon';
import OriginsRoutes from '../../../../maps/origins/routes/OriginsRoutes';
import MobRoutes from '../../../../maps/mob-of-the-dead/routes/MobRoutes';
import DerEisendracheRoutes from '../../../../maps/der-eisendrache/routes/DerEisendracheRoutes';
import ZetsubouRoutes from '../../../../maps/zetsubou-no-shima/routes/ZetsubouRoutes';
import GorodRoutes from '../../../../maps/gorod-krovi/routes/GorodRoutes';
import RevelationsRoutes from '../../../../maps/revelations/routes/RevelationsRoutes';

export default function AppRoutes({ RootLayout }) {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="allmaps" element={<AllMaps />} />
        <Route path="easter-eggs" element={<EasterEggs />} />
        <Route path="easter-eggs/:slug" element={<EasterEggGuide />} />
        <Route path="info/:slug" element={<MapInfo />} />
        <Route path="side-easter-eggs" element={<SideEasterEggList />} />
        <Route path="side-easter-eggs/:mapKey" element={<SideEEInfo />} />
        <Route path="coming-soon" element={<ComingSoon />} />

        {/* Dedicated guide applications now mount inside the Hub shell. */}
        <Route path="maps/origins/*" element={<OriginsRoutes />} />
        <Route path="maps/mob-of-the-dead/*" element={<MobRoutes />} />
        <Route path="maps/der-eisendrache/*" element={<DerEisendracheRoutes />} />
        <Route path="maps/zetsubou-no-shima/*" element={<ZetsubouRoutes />} />
        <Route path="maps/gorod-krovi/*" element={<GorodRoutes />} />
        <Route path="maps/revelations/*" element={<RevelationsRoutes />} />

        {/* Non-dedicated maps keep the original Hub details behavior. */}
        <Route path="maps/:slug" element={<MapDetails />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
