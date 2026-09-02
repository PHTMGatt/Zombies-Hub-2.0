import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const setup = [
  ['Anywhere But Here!', 'Bring this GobbleGum into the game. It is required for the hidden-room cog.'],
  ['All three Trials', 'Complete your three challenge tablets during setup; the completed trials also feed into the electrified-shield cog step.'],
  ['Skull of Nan Sapwe', 'Clean all four skulls and finish the Keeper encounter so Mesmerize is available for hidden quest objects.'],
  ['KT-4 → Masamune', 'Build the KT-4, then complete the upgrade ingredients before the elevator/boss stretch.'],
  ['Zombie Shield', 'Build it during setup and keep a usable shield for the electrified zipline cog.'],
  ['Gas Mask', 'Build one during setup and replace it with a fresh mask before the elevator descent.'],
  ['Bucket + Seeds', 'Keep the bucket and seeds moving through the colored-water plant steps instead of leaving them until the end.'],
];

const Prerequisites = () => (
  <main className="zets-detail-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Setup Checklist"
      description="The things that can stall Seeds of Doubt later if you ignore them during the early rounds."
    >
      <GuideChip>Anywhere But Here!</GuideChip>
      <GuideChip>3 Trials</GuideChip>
      <GuideChip>KT-4 / Masamune</GuideChip>
    </GuideHero>

    <GuideCallout label="Run philosophy" tone="info" className="zets-detail-note">
      Do these alongside power, Pack-a-Punch, and skull setup. The goal is to arrive at the three-cog stage with the specialist, shield, gas mask, and Masamune progression already handled.
    </GuideCallout>

    <GuideSection kicker="Checklist" title="Have these covered before the endgame">
      <div className="zets-checklist-grid">
        {setup.map(([title, body], index) => (
          <article className="zets-detail-card" key={title}>
            <span className="zets-detail-number">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
    </GuideSection>
  </main>
);

export default Prerequisites;
