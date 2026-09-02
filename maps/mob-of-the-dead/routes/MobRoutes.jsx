import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import MobMain from '../src/pages/MobMain';
import Plane from '../src/pages/Plane';
import RetrieverSkulls from '../src/pages/RetrieverSkulls';
import Codes from '../src/pages/Codes';
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
          <Route path="plane" element={<Plane />} />
          <Route path="retriever-skulls" element={<RetrieverSkulls />} />
          <Route path="codes" element={<Codes />} />
          <Route path="final-step" element={<FinalStep />} />

          {/* Preserve old 1.0 links while routing them into the corrected 2.0 flow. */}
          <Route path="free-blundergat" element={<Navigate to="../retriever-skulls" replace />} />
          <Route path="spoon" element={<Navigate to="../retriever-skulls" replace />} />
          <Route path="redeemer" element={<Navigate to="../retriever-skulls" replace />} />
          <Route path="logs" element={<Navigate to="../codes" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </section>
  );
}
