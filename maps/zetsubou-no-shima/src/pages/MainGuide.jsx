import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import '../styles/Guide.css';

const BASE = '/maps/zetsubou-no-shima';

const phases = [
  {
    title: 'Setup the Map',
    summary: 'Finish your three Trials, clean all four skulls, open the bunker/Pack-a-Punch, build the gas mask and Shield, then build the KT-4.',
    to: `${BASE}/prerequisites`,
    link: 'Open Setup Checklist',
  },
  {
    title: 'Skull + Masamune + Elevator',
    summary: 'Use the Skull of Nan Sapwe to reveal the hidden elevator machinery, then finish the KT-4 upgrade into the Masamune.',
    to: `${BASE}/reveal-blueprint`,
    link: 'Open Elevator Setup',
  },
  {
    title: 'Collect the Three Cogs',
    summary: 'Get the Anywhere But Here! cog, shoot down the plane with the AA cannon, then use the electrified zipline for the final cog.',
    to: `${BASE}/cogs`,
    link: 'Open Cog Guide',
  },
  {
    title: 'Descend + Kill the Giant Thrasher',
    summary: 'Install all three cogs, take a fresh gas mask and the Masamune into the elevator, then complete the Thrasher boss fight.',
    to: `${BASE}/elevator-battle`,
    link: 'Open Boss Guide',
  },
];

const MainGuide = () => (
  <main className="zets-main-guide">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Seeds of Doubt"
      description="The whole quest in four phases. Use the detailed tabs only when you reach that part of the run."
    >
      <GuideChip>Trials required</GuideChip>
      <GuideChip>Anywhere But Here! required</GuideChip>
    </GuideHero>

    <GuideCallout label="Before you commit" tone="info" className="zets-guide-note">
      Keep a bucket, finish all three Trials, and have Anywhere But Here! available before the cog phase.
    </GuideCallout>

    <GuideSection kicker="Main Run" title="Four phases">
      <GuideStepList>
        {phases.map((phase, index) => (
          <GuideStepCard
            key={phase.title}
            step={index + 1}
            label="Main Quest"
            title={phase.title}
            summary={phase.summary}
          >
            <Link className="zets-phase-link" to={phase.to}>{phase.link} →</Link>
          </GuideStepCard>
        ))}
      </GuideStepList>
    </GuideSection>

    <GuideSection kicker="Reference" title="Extra pages">
      <div className="zets-reference-grid">
        <Link to={`${BASE}/buildables`}>Buildables + KT-4</Link>
        <Link to={`${BASE}/extras`}>Rewards + Extras</Link>
      </div>
    </GuideSection>
  </main>
);

export default MainGuide;
