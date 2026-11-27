import React from 'react';
import '@fontsource/rajdhani/latin-700.css';
import NotFound from '../../../shared/ui/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
// OG restore (2026-11-22): the original Origins-Guide pages, header, nav and footer, copied from
// github.com/PHTMGatt/Origins-Guide (d64023e) into maps/origins/og and adapted only for hub routes and asset paths.
import Header from '../og/components/Header';
import Footer from '../og/components/Footer';
import MainGuide from '../og/Pages/MainGuide';
import FireStaff from '../og/Pages/FireStaff';
import IceStaff from '../og/Pages/IceStaff';
import WindStaff from '../og/Pages/WindStaff';
import LightningStaff from '../og/Pages/LightningStaff';
import '../og/Styles/global.css';
// Speed Run is hub-only and linked from Side EEs. The OG has no step-details or og page: those old URLs go to the main guide.
import SpeedRunLayout from '../src/Pages/SpeedRun/SpeedRunLayout';
import SpeedRunRoute from '../src/Pages/SpeedRun/SpeedRunRoute';
import SpeedRunPrep from '../src/Pages/SpeedRun/SpeedRunPrep';
import SpeedRunLightning from '../src/Pages/SpeedRun/SpeedRunLightning';
import RobotBg from '../public/images/Robot.webp?url';
import '../src/Styles/origins-tokens.css';

export default function OriginsRoutes() {
  return (
    <section className="map-module origins-module" style={{ '--origins-bg': `url(${RobotBg})` }}>
      <div className="layout-container">
        <Header />
        <main>
          <Routes>
            <Route index element={<MainGuide />} />
            <Route path="fire-staff" element={<FireStaff />} />
            <Route path="ice-staff" element={<IceStaff />} />
            <Route path="wind-staff" element={<WindStaff />} />
            <Route path="lightning-staff" element={<LightningStaff />} />
            <Route path="og" element={<Navigate to="/maps/origins" replace />} />
            <Route path="step-details" element={<Navigate to="/maps/origins" replace />} />
            <Route path="speed-run" element={<SpeedRunLayout />}>
              <Route index element={<SpeedRunRoute />} />
              <Route path="prep" element={<SpeedRunPrep />} />
              <Route path="lightning" element={<SpeedRunLightning />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* The original standalone route names. */}
            <Route path="FireStaff" element={<FireStaff />} />
            <Route path="IceStaff" element={<IceStaff />} />
            <Route path="WindStaff" element={<WindStaff />} />
            <Route path="LightningStaff" element={<LightningStaff />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </section>
  );
}
