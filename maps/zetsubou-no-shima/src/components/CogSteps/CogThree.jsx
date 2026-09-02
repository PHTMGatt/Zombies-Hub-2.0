import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CogThree = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <section className="guide-section">
          <h2 className="guide-title">Cog 3 – Electrified Shield Zipline Drop</h2>
          <p>
            After completing all <strong>Trials of the Ancients</strong>, stand on the lightning platform with your shield equipped to charge it.
          </p>
          <p>
            Head to the zipline between Lab A and the Docks. Use the charged shield to shock the panel.
          </p>

          <h3 className="guide-subtitle">How to Drop onto the Dock</h3>
          <ul>
            <li><strong>Solo:</strong> Shock the panel, ride the zipline, melee mid-ride to drop.</li>
            <li><strong>Co-op:</strong> One rides while the other shocks the panel to drop them.</li>
          </ul>

          <p>
            Start from the Docks heading toward Lab A. Missing the drop results in instant death.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CogThree;
