import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Home from '../src/pages/Home';
import Parts from '../src/pages/Parts';
import Wisp from '../src/pages/Wisp';
import Bows from '../src/pages/bows/Bows';
import BaseBow from '../src/pages/bows/BaseBow';
import ElectricBow from '../src/pages/bows/ElectricBow';
import FireBow from '../src/pages/bows/FireBow';
import WolfBow from '../src/pages/bows/WolfBow';
import VoidBow from '../src/pages/bows/VoidBow';
import '../src/styles/global.css';

export default function DerEisendracheRoutes() {
  return (
    <section className="map-module de-module">
      <Header />
      <div className="header-spacer" />
      <div className="page-wrapper">
        <Routes>
          <Route index element={<Home />} />
          <Route path="parts" element={<Parts />} />
          <Route path="wisps" element={<Wisp />} />
          <Route path="bows" element={<Bows />}>
            <Route index element={<div className="bows-content"><p>Select a bow above to view its upgrade steps.</p></div>} />
            <Route path="base" element={<BaseBow />} />
            <Route path="electric" element={<ElectricBow />} />
            <Route path="fire" element={<FireBow />} />
            <Route path="wolf" element={<WolfBow />} />
            <Route path="void" element={<VoidBow />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </section>
  );
}
