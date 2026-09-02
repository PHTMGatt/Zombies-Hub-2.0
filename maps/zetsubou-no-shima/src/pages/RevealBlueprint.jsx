import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RevealBlueprint = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <section className="guide-section">
          <h2 className="guide-title">Step 1: Reveal the Blueprint & Elevator Machinery</h2>

          <p>
            After obtaining the <strong>Skull of Nan Sapwe</strong>, head to the <strong>Bunker Living Quarters</strong> near the
            purple water pool. On the wall across from the pool, you’ll find a torn blueprint. Use the Skull’s
            <strong> Mesmerize</strong> ability to reveal the second half of the plan.
          </p>

          <p>
            This unlocks the ability to expose hidden doors and walls throughout the map using the Skull’s power.
          </p>

          <h3 className="guide-subtitle">Finding the Elevator Panel</h3>
          <p>
            Travel to the <strong>Anti-Aircraft Platform</strong>. Just across from its entrance is a sealed elevator.
            To the left of it is a concealed wall — use <strong>Mesmerize</strong> again to reveal a broken generator panel.
          </p>

          <p>
            The elevator now displays its missing components — <strong>three cogs</strong>. These become your next goal.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RevealBlueprint;
