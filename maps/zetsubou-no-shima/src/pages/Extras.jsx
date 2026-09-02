import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const perks = [
  'Quick Revive',
  'Juggernog',
  'Double Tap II',
  'Speed Cola',
  'Mule Kick',
  'Electric Cherry',
  "Widow's Wine",
  'Stamin-Up',
  'Deadshot Daiquiri',
];

const Extras = () => (
  <main className="zets-detail-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Rewards + Completion"
      description="What Seeds of Doubt gives you after the final Giant Thrasher sequence, plus the few post-completion details worth remembering."
    >
      <GuideChip>Seeds of Doubt</GuideChip>
      <GuideChip>5,000 XP</GuideChip>
      <GuideChip>Gateworm marker</GuideChip>
    </GuideHero>

    <GuideSection kicker="Completion Rewards" title="What you actually receive">
      <div className="zets-reward-grid">
        <article className="zets-detail-card">
          <span className="zets-detail-number">01</span>
          <div>
            <h3>Every perk on the map</h3>
            <p>{perks.join(' · ')}</p>
          </div>
        </article>
        <article className="zets-detail-card">
          <span className="zets-detail-number">02</span>
          <div>
            <h3>Seeds of Doubt achievement</h3>
            <p>Completing the main quest unlocks the Seeds of Doubt achievement/trophy.</p>
          </div>
        </article>
        <article className="zets-detail-card">
          <span className="zets-detail-number">03</span>
          <div>
            <h3>5,000 XP</h3>
            <p>The completion reward includes 5,000 XP under the Horticultural Heroism reward title.</p>
          </div>
        </article>
        <article className="zets-detail-card">
          <span className="zets-detail-number">04</span>
          <div>
            <h3>Gateworm completion marker</h3>
            <p>A Gateworm icon appears for Zetsubou No Shima on the map-selection completion tracker.</p>
          </div>
        </article>
      </div>
    </GuideSection>

    <GuideCallout label="Perk warning" tone="info" className="zets-detail-note zets-reward-note">
      The reward does not permanently increase your perk slots. If you go down afterward, the granted perks can still be lost unless another mechanic or GobbleGum protects them.
    </GuideCallout>

    <GuideSection kicker="After the Cutscene" title="The run is complete">
      <div className="zets-post-complete">
        <p>The players return to the boss arena after completion. Use the elevator to get back to the main map if you are continuing the game.</p>
        <p>The ending resolves Takeo's Zetsubou No Shima story beat and marks this map complete for the Black Ops III Gateworm tracking system.</p>
      </div>
    </GuideSection>
  </main>
);

export default Extras;
