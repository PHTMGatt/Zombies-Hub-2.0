import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const BASE = '/maps/zetsubou-no-shima';

const cogs = [
  {
    number: '01',
    title: 'Anywhere But Here! Room',
    summary: 'Use the required GobbleGum after the elevator quest is active to reach the hidden room and grab the first cog.',
    to: `${BASE}/cogs/1`,
  },
  {
    number: '02',
    title: 'AA Cannon Plane',
    summary: 'Create the artillery shell, fire the AA cannon at the cargo plane, then recover the cog where it lands.',
    to: `${BASE}/cogs/2`,
  },
  {
    number: '03',
    title: 'Electrified Zipline Drop',
    summary: 'Charge the shield from the completed Trials and use the electrified zipline setup to drop onto the hidden dock.',
    to: `${BASE}/cogs/3`,
  },
];

const Cogs = () => (
  <main className="zets-detail-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="The Three Cogs"
      description="Three completely different mini-objectives power the elevator. Pick the cog you are currently working on and ignore the other two."
    >
      <GuideChip>Anywhere But Here!</GuideChip>
      <GuideChip>AA Cannon</GuideChip>
      <GuideChip>Electrified Shield</GuideChip>
    </GuideHero>

    <GuideCallout label="Order" tone="info" className="zets-detail-note">
      The cogs do not need to be collected in the order shown here. Route them around your GobbleGum, plant growth, shield charge, and current round.
    </GuideCallout>

    <GuideSection kicker="Cog Routes" title="Choose the objective you need">
      <div className="zets-cog-grid">
        {cogs.map((cog) => (
          <Link className="zets-cog-card" to={cog.to} key={cog.title}>
            <span className="zets-detail-number">{cog.number}</span>
            <div>
              <h3>{cog.title}</h3>
              <p>{cog.summary}</p>
              <span className="zets-cog-open">Open cog guide →</span>
            </div>
          </Link>
        ))}
      </div>
    </GuideSection>
  </main>
);

export default Cogs;
