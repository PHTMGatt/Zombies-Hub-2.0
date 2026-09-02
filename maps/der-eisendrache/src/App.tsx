// src/'App.tsx'
// ------------------------

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Parts from './pages/Parts';
import Bows from './pages/bows/Bows';
import BaseBow from './pages/bows/BaseBow';
import ElectricBow from './pages/bows/ElectricBow';
import FireBow from './pages/bows/FireBow';
import WolfBow from './pages/bows/WolfBow';
import VoidBow from './pages/bows/VoidBow';
import Wisp from './pages/Wisp';

import './styles/global.css';

const App: React.FC = () => (
  <Router>
    <Header />
    <div className="header-spacer" />
    <div className="page-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/wisps" element={<Wisp />} />

        <Route path="/bows" element={<Bows />}>
          <Route
            index
            element={
              <div className="bows-content">
                <p>Select a bow above to view its upgrade steps.</p>
              </div>
            }
          />
          <Route path="base" element={<BaseBow />} />
          <Route path="electric" element={<ElectricBow />} />
          <Route path="fire" element={<FireBow />} />
          <Route path="wolf" element={<WolfBow />} />
          <Route path="void" element={<VoidBow />} />
        </Route>
      </Routes>
    </div>
    <Footer />
  </Router>
);

export default App;
