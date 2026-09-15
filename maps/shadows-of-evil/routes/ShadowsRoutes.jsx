import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MainGuide from '../src/pages/MainGuide';
import '../src/styles/Shadows.css';

export default function ShadowsRoutes() {
  return (
    <section className="map-module shadows-module">
      <Header />
      <Routes>
        <Route index element={<MainGuide />} />
        <Route path="*" element={<Navigate to="/maps/shadows-of-evil" replace />} />
      </Routes>
      <Footer />
    </section>
  );
}
