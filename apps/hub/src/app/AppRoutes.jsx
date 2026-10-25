import React, { lazy, Suspense } from 'react';
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
import RouteFallback from '../../../../shared/ui/RouteFallback';

// Each dedicated map is its own chunk (JS + CSS), fetched on first visit.
const OriginsRoutes = lazy(() => import('../../../../maps/origins/routes/OriginsRoutes'));
const MobRoutes = lazy(() => import('../../../../maps/mob-of-the-dead/routes/MobRoutes'));
const ShadowsRoutes = lazy(() => import('../../../../maps/shadows-of-evil/routes/ShadowsRoutes'));
const DerEisendracheRoutes = lazy(() => import('../../../../maps/der-eisendrache/routes/DerEisendracheRoutes'));
const ZetsubouRoutes = lazy(() => import('../../../../maps/zetsubou-no-shima/routes/ZetsubouRoutes'));
const GorodRoutes = lazy(() => import('../../../../maps/gorod-krovi/routes/GorodRoutes'));
const RevelationsRoutes = lazy(() => import('../../../../maps/revelations/routes/RevelationsRoutes'));

const mapModule = (Module) => (
  <Suspense fallback={<RouteFallback />}>
    <Module />
  </Suspense>
);

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
        <Route path="maps/origins/*" element={mapModule(OriginsRoutes)} />
        <Route path="maps/mob-of-the-dead/*" element={mapModule(MobRoutes)} />
        <Route path="maps/shadows-of-evil/*" element={mapModule(ShadowsRoutes)} />
        <Route path="maps/der-eisendrache/*" element={mapModule(DerEisendracheRoutes)} />
        <Route path="maps/zetsubou-no-shima/*" element={mapModule(ZetsubouRoutes)} />
        <Route path="maps/gorod-krovi/*" element={mapModule(GorodRoutes)} />
        <Route path="maps/revelations/*" element={mapModule(RevelationsRoutes)} />

        {/* Non-dedicated maps keep the original Hub details behavior. */}
        <Route path="maps/:slug" element={<MapDetails />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
