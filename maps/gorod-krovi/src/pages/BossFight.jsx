import React from 'react';
import '../styles/BossFight.css';

const BossFight = () => (
  <main className="bossfight-page">
    <section className="glass-card bossfight-card">
      <h2 className="section-title">Step Seven: The Boss Fight</h2>

      <h3 className="step-title-glow">Phase 1: Dragon Encounter</h3>
      <p className="step-text">
        Power the core and hit the button to summon the dragon. Stay in the trenches to dodge its fire breath,
        then lock onto each weak spot—right wing, belly, and neck—as they appear. If you need cover or fire immunity,
        use Guard of Fafnir or Draconite Controller, and drop Monkey Bombs or Dragon Strike to clear any incoming zombies.
      </p>

      <h3 className="step-title-glow">Phase 2: Nikolai’s Mech</h3>
      <p className="step-text">
        After the dragon goes down, hustle under Nikolai’s mech to avoid its minigun and choppers.
        Destroy its four yellow cores, then finish off the glowing center core on the torso.
        Use debris for cover and GobbleGums like Danger Closest or Idle Eyes to keep the horde at bay while you focus fire.
      </p>
    </section>
  </main>
);

export default BossFight;
