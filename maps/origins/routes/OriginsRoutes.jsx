import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/Pages/MainGuide';
import FireStaff from '../src/Pages/FireStaff';
import IceStaff from '../src/Pages/IceStaff';
import WindStaff from '../src/Pages/WindStaff';
import LightningStaff from '../src/Pages/LightningStaff';
import RobotBg from '../public/images/Robot.webp?url';
import '../styles/origins-shell.css';

export default function OriginsRoutes() {
  return (
    <section
      className="map-module origins-module"
      style={{ '--origins-bg': `url(${RobotBg})` }}
    >
      <Header />
      <div className="origins-route-content">
        <Routes>
          <Route index element={<MainGuide />} />
          <Route path="fire-staff" element={<FireStaff />} />
          <Route path="ice-staff" element={<IceStaff />} />
          <Route path="wind-staff" element={<WindStaff />} />
          <Route path="lightning-staff" element={<LightningStaff />} />

          {/* Compatibility with the original standalone route names. */}
          <Route path="FireStaff" element={<FireStaff />} />
          <Route path="IceStaff" element={<IceStaff />} />
          <Route path="WindStaff" element={<WindStaff />} />
          <Route path="LightningStaff" element={<LightningStaff />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
