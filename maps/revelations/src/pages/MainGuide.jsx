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
import '../styles/MainGuide.css';

const BASE = '/maps/revelations';

const phases = [
  {
    title: 'Open Pack-a-Punch + Prepare the Run',
    summary: 'Shoot the tombstones in 2 → 3 → 1 → 4 order, activate all four Corruption Engines, open the Giant Apothicon, build the Keeper Protector, and secure the required weapons.',
    to: `${BASE}/apothicon-upgrade`,
    link: 'Open Apothicon Upgrade',
  },
  {
    title: 'Collect the Three Audio Reels',
    summary: 'Complete the Keeper ritual, throw Little Arnies into all nine Apothicon holes, and finish the six-bone sequence to collect and place all three reels.',
  },
  {
    title: 'S.O.P.H.I.A. + Eggs + Runes',
    summary: 'Hit all four turret rocks, activate S.O.P.H.I.A., collect the Kronorium, charge the four eggs into Gateworms, then locate all four Runes of Creation.',
    to: `${BASE}/egg-locations`,
    link: 'Open Egg Locations',
  },
  {
    title: 'Symbol Room + Summoning Key',
    summary: 'Enter the random four-symbol order, clear the Margwa waves, collect the Summoning Key, then hit all seven required objects around the map.',
    to: `${BASE}/summoning-key`,
    link: 'Open Summoning Key Guide',
  },
  {
    title: 'Final Shadowman Fight',
    summary: 'Charge an altar, throw the Summoning Key through ghost S.O.P.H.I.A., damage the Shadowman until he is pushed into the Apothicon mouth, then interact with the book to finish.',
  },
];

const MainGuide = () => (
  <main className="rev-page rev-main-guide">
    <div className="rev-background" />
    <div className="rev-main-content">
      <GuideHero
        kicker="Revelations"
        title="For The Good Of All"
        description="Five phases for the whole quest. Use the dedicated pages for the location-heavy parts instead of scrolling through every interaction here."
      >
        <GuideChip>Apothicon Servant</GuideChip>
        <GuideChip>Little Arnies</GuideChip>
        <GuideChip>Keeper Protector</GuideChip>
      </GuideHero>

      <GuideCallout label="Random step" tone="info" className="rev-main-note">
        The four-symbol order in the boss room changes every game. Copy the order shown by the book; do not memorize a fixed code.
      </GuideCallout>

      <GuideSection kicker="Main Run" title="Five phases">
        <GuideStepList>
          {phases.map((phase, index) => (
            <GuideStepCard
              key={phase.title}
              step={index + 1}
              label="Main Quest"
              title={phase.title}
              summary={phase.summary}
            >
              {phase.to && <Link className="rev-phase-link" to={phase.to}>{phase.link} →</Link>}
            </GuideStepCard>
          ))}
        </GuideStepList>
      </GuideSection>

      <GuideSection kicker="Rune Placement" title="Need the sound-step locations?">
        <Link className="rev-sound-link" to={`${BASE}/sound-step`}>Open the compact Sound Step reference →</Link>
      </GuideSection>
    </div>
  </main>
);

export default MainGuide;
