import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../../../../shared/ui/NotFound';

const AllMaps = lazy(() => import('../pages/AllMaps'));
const EasterEggs = lazy(() => import('../pages/EasterEggs'));
const EasterEggGuide = lazy(() => import('../pages/EasterEggGuide'));
const MapDetails = lazy(() => import('../pages/MapDetails'));
const MapInfo = lazy(() => import('../pages/MapInfo'));
const SideEasterEggList = lazy(() => import('../pages/SideEasterEggList'));
const SideEEInfo = lazy(() => import('../pages/SideEEInfo'));
const ComingSoon = lazy(() => import('../pages/ComingSoon'));
const OriginsRoutes = lazy(() => import('../../../../maps/origins/routes/OriginsRoutes'));
const MobRoutes = lazy(() => import('../../../../maps/mob-of-the-dead/routes/MobRoutes'));
const ShadowsRoutes = lazy(() => import('../../../../maps/shadows-of-evil/routes/ShadowsRoutes'));
const DerEisendracheRoutes = lazy(() => import('../../../../maps/der-eisendrache/routes/DerEisendracheRoutes'));
const ZetsubouRoutes = lazy(() => import('../../../../maps/zetsubou-no-shima/routes/ZetsubouRoutes'));
const GorodRoutes = lazy(() => import('../../../../maps/gorod-krovi/routes/GorodRoutes'));
const RevelationsRoutes = lazy(() => import('../../../../maps/revelations/routes/RevelationsRoutes'));

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
        <Route path="maps/shadows-of-evil/*" element={<ShadowsRoutes />} />
        <Route path="maps/der-eisendrache/*" element={<DerEisendracheRoutes />} />
        <Route path="maps/zetsubou-no-shima/*" element={<ZetsubouRoutes />} />
        <Route path="maps/gorod-krovi/*" element={<GorodRoutes />} />
        <Route path="maps/revelations/*" element={<RevelationsRoutes />} />

        {/* Non-dedicated maps keep the original Hub details behavior. */}
        <Route path="maps/:slug" element={<MapDetails />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
