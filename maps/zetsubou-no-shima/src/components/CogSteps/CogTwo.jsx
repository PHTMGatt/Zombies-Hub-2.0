import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CogTwo = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <section className="guide-section">
          <h2 className="guide-title">Cog 2 – Blue Water Plant & AA Cannon</h2>
          <p>
            Grow a plant using <strong>Blue Water</strong> and shoot it with the <strong>KT-4</strong> for 3 rounds to spawn a <strong>Flak Shell</strong>.
          </p>
          <p>
            Load the shell into the cannon near the Anti-Aircraft Platform. When a cargo plane flies overhead, shoot it down. The cog will fall at one of several locations on the map:
          </p>
          <ul>
            <li>Outside the bunker near the big tree</li>
            <li>Backstairs near Lab A zipline</li>
            <li>Behind Lab B near the green pool</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CogTwo;
