import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Prerequisites = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <section className="guide-section">
          <h2 className="guide-title">Prerequisites</h2>

          <p>
            Before starting the <strong>Seeds of Doubt</strong> Easter Egg, make sure every player has completed or obtained the following:
          </p>

          <ul className="guide-list">
            <li><strong>Skull of Nan Sapwe</strong> – Fully obtained and unlocked</li>
            <li><strong>Anywhere But Here!</strong> GobbleGum – Needed to access the Cog 1 hidden room</li>
            <li><strong>KT-4</strong> – Must be crafted; used in multiple steps and upgraded to the Masamune</li>
            <li><strong>Gas Mask</strong> – Required to survive the elevator descent</li>
            <li><strong>Zombie Shield</strong> – Used to electrify the zipline for Cog 3</li>
            <li><strong>All Trials of the Ancients</strong> – Each player must complete all three of their trials</li>
            <li><strong>Bucket</strong> – For collecting and using colored water for plant growth</li>
            <li><strong>Seeds</strong> – At least two: one for the Masamune upgrade and one for the Flak Shell (Cog 2)</li>
          </ul>

          <p className="note">
            <strong>Note:</strong> If any player is missing a required item or step, it can prevent progression.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Prerequisites;
