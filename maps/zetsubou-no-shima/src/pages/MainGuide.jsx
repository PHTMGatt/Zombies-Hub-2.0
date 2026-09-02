import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

import '../styles/Guide.css';

const MainGuide = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <BackButton />

        <section className="guide-section">
          <h2 className="guide-title">Welcome to the Zetsubou No Shima Easter Egg Guide</h2>

          <p>
            The <strong>Seeds of Doubt</strong> Easter Egg follows your mission to save the original Takeo Masaki.
            This guide walks you through every step — from powering the hidden elevator to defeating the Giant Thrasher boss.
          </p>
        </section>

        <section className="guide-section">
          <h3 className="guide-subtitle">Overview</h3>
          <p>
            Completing this Easter Egg grants <strong>every perk</strong>, bonus XP, the <em>Seeds of Doubt</em> achievement,
            and a Gateworm icon on the map select screen.
          </p>
          <p>
            The final cutscene contains lore connecting Primis and Ultimis Takeo — including the reveal of <strong>blood vials</strong>
            and the moment of ultimate sacrifice.
          </p>
          <Link to="/extras" className="guide-glow-button">View Rewards & Trivia</Link>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MainGuide;
