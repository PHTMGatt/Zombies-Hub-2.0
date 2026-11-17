import React from 'react';
import '@fontsource/rajdhani/latin-500.css';
import '@fontsource/rajdhani/latin-600.css';
import '@fontsource/rajdhani/latin-700.css';
import NotFound from '../../../shared/ui/NotFound';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/Pages/MainGuide';
import OGGuide from '../src/Pages/OGGuide';
import FireStaff from '../src/Pages/FireStaff';
import IceStaff from '../src/Pages/IceStaff';
import WindStaff from '../src/Pages/WindStaff';
import LightningStaff from '../src/Pages/LightningStaff';
import SpeedRunLayout from '../src/Pages/SpeedRun/SpeedRunLayout';
import SpeedRunRoute from '../src/Pages/SpeedRun/SpeedRunRoute';
import SpeedRunPrep from '../src/Pages/SpeedRun/SpeedRunPrep';
import SpeedRunLightning from '../src/Pages/SpeedRun/SpeedRunLightning';
import RobotBg from '../public/images/Robot.webp?url';
import '../src/Styles/origins-tokens.css';
import '../styles/origins-shell.css';
import BackToStep from '../../../shared/guide/BackToStep';
import originsGuide from '../src/data/originsGuide';
import StepDetails from '../src/Pages/StepDetails';

export default function OriginsRoutes() {
  return (
    // Main's Main Guide and OG pages paint the robot backdrop from --origins-bg (merge with main, 2026-11-15).
    <section className="map-module origins-module" style={{ '--origins-bg': `url(${RobotBg})` }}>
      <Header />
      <div className="origins-route-content">
        <BackToStep guidePath="/maps/origins" steps={originsGuide} />
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="og" element={<OGGuide />} />
          <Route path="step-details" element={<StepDetails />} />
          <Route path="fire-staff" element={<FireStaff />} />
          <Route path="ice-staff" element={<IceStaff />} />
          <Route path="wind-staff" element={<WindStaff />} />
          <Route path="lightning-staff" element={<LightningStaff />} />
          <Route path="speed-run" element={<SpeedRunLayout />}>
            <Route index element={<SpeedRunRoute />} />
            <Route path="prep" element={<SpeedRunPrep />} />
            <Route path="lightning" element={<SpeedRunLightning />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Compatibility with the original standalone route names. */}
          <Route path="FireStaff" element={<FireStaff />} />
          <Route path="IceStaff" element={<IceStaff />} />
          <Route path="WindStaff" element={<WindStaff />} />
          <Route path="LightningStaff" element={<LightningStaff />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
