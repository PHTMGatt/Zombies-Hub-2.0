import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

const Extras = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <BackButton />

        <section className="guide-section">
          <h2 className="guide-title">Full Rewards & Trivia</h2>

          <section className="extras-section">
            <h3 className="guide-subtitle">Rewards</h3>
            <ul className="guide-list">
              <li>
                All players receive <strong>every perk</strong> on the map:
                <ul className="nested-list">
                  <li>Juggernog</li>
                  <li>Quick Revive</li>
                  <li>Double Tap II</li>
                  <li>Speed Cola</li>
                  <li>Mule Kick</li>
                  <li>Electric Cherry</li>
                  <li>Widow's Wine</li>
                  <li>Stamin-Up</li>
                  <li>Deadshot Daiquiri</li>
                </ul>
              </li>
              <li><strong>Seeds of Doubt</strong> achievement unlocks</li>
              <li>Gateworm icon appears on the map selection screen</li>
              <li>Earn <strong>5000 XP</strong> with the title “Horticultural Heroism”</li>
              <li>Players respawn in the boss arena and must use the elevator to return to the surface</li>
            </ul>

            <p className="note">
              <strong>Note:</strong> Perk slots are not permanent. All perks are lost when downed unless protected by GobbleGums like Aftertaste or Phoenix Up.
            </p>
          </section>

          <section className="extras-section">
            <h3 className="guide-subtitle">Trivia</h3>
            <ul className="guide-list">
              <li>After completion, all characters visibly carry <strong>two blood vials</strong></li>
              <li>Dempsey & Nikolai wear them at their sides; Takeo keeps his on his back</li>
              <li>Cutscene reveals Ultimis Takeo was betrayed by the Emperor</li>
              <li>Primis Takeo performs <strong>seppuku</strong> as Ultimis Takeo's kaishakunin</li>
              <li>Richtofen collects Takeo's soul in the Summoning Key, then teleports the group briefly</li>
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Extras;
