import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

const ElevatorBattle = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <BackButton />

        <section className="guide-section">
          <h2 className="guide-title">Step 3: Activate the Elevator & Fight the Giant Thrasher</h2>

          <p>
            After collecting all three cogs, bring them to the generator room behind the elevator.
            Hold the action button to install them and power the elevator.
          </p>

          <p>
            <strong>Important:</strong> Every player must have a <strong>Gas Mask</strong>, or they will instantly go down when the elevator descends.
            One player must also possess the <strong>Masamune</strong> (KT-4 upgrade).
          </p>

          <p>
            Enter the elevator and descend to the lower chamber. Use the Masamune to clear the glowing vines and proceed into the boss area.
          </p>

          <h3 className="guide-subtitle">Boss Fight – Giant Thrasher</h3>
          <ul className="guide-list">
            <li>Shoot the glowing weakspot spores on its arms with the Masamune.</li>
            <li>Spores appear one at a time and are time-gated — be patient.</li>
            <li>Survive waves of zombies, spiders, and standard Thrashers during downtime.</li>
            <li>Watch out for vine slam attacks down the center of the arena.</li>
          </ul>

          <p>
            After destroying the fourth spore, the Giant Thrasher dies, and the <strong>ending cutscene</strong> begins.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ElevatorBattle;
