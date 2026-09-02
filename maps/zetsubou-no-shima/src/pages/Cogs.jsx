import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';
import '../styles/Guide.css';

const BASE = '/maps/zetsubou-no-shima';

const Cogs = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <BackButton />

        <section className="guide-section">
          <h2 className="guide-title">⚙️ Collecting the Cogs</h2>
          <p>
            After revealing the elevator machinery using the Skull of Nan Sapwe, you’ll need to gather 3 unique cogs scattered across Zetsubou No Shima.
            Each cog requires a different method and unlocks access to the final boss battle.
          </p>
        </section>

        <section className="guide-section">
          <h3 className="guide-subtitle">🧭 Select a Cog Step</h3>
          <ul className="guide-list">
            <li><Link className="guide-link-button" to={`${BASE}/cogs/1`}>⚙️ Cog 1 – Anywhere But Here! Room <span className="arrow-link">↗</span></Link></li>
            <li><Link className="guide-link-button" to={`${BASE}/cogs/2`}>💥 Cog 2 – Blue Water & AA Cannon <span className="arrow-link">↗</span></Link></li>
            <li><Link className="guide-link-button" to={`${BASE}/cogs/3`}>⚡ Cog 3 – Electrified Zipline Drop <span className="arrow-link">↗</span></Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cogs;
