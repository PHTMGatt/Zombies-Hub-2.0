import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MobMain from '../src/pages/MobMain';
import FreeBlundergat from '../src/pages/FreeBlundergat';
import Spoon from '../src/pages/Spoon';
import Redeemer from '../src/pages/Redeemer';
import Logs from '../src/pages/Logs';
import FinalStep from '../src/pages/FinalStep';
import NotFound from '../src/pages/NotFound';
import '../src/styles/global.css';
import '../src/styles/components.css';

export default function MobRoutes() {
  return (
    <section className="map-module mob-module">
      <div className="bg-blur" />
      <div className="bg-tint" />
      <Header />
      <main className="app-main">
        <Routes>
          <Route index element={<MobMain />} />
          <Route path="free-blundergat" element={<FreeBlundergat />} />
          <Route path="spoon" element={<Spoon />} />
          <Route path="redeemer" element={<Redeemer />} />
          <Route path="logs" element={<Logs />} />
          <Route path="final-step" element={<FinalStep />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </section>
  );
}
