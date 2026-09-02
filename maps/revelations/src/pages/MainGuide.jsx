import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
} from '../../../../shared/ui/GuideLayout';
import '../styles/MainGuide.css';

const BASE = '/maps/revelations';

const phases = [
  {
    title: 'Open Pack-a-Punch + Prepare',
    summary: 'Shoot the tombstones 2 → 3 → 1 → 4, activate the four Corruption Engines, open the Giant Apothicon, build the Keeper Protector, and secure the required weapons.',
    to: `${BASE}/apothicon-upgrade`,
    link: 'Apothicon Upgrade',
  },
  {
    title: 'Three Audio Reels',
    summary: 'Complete the Keeper ritual, throw Little Arnies into all nine Apothicon holes, and finish the six-bone sequence to collect and place all three reels.',
  },
  {
    title: 'S.O.P.H.I.A. + Eggs + Runes',
    summary: 'Hit all four turret rocks, activate S.O.P.H.I.A., collect the Kronorium, charge the four eggs into Gateworms, then locate the four Runes of Creation.',
    to: `${BASE}/egg-locations`,
    link: 'Egg Locations',
  },
  {
    title: 'Symbols + Summoning Key',
    summary: 'Enter the random four-symbol order, clear the Margwa waves, collect the Summoning Key, then hit all seven required objects around the map.',
    to: `${BASE}/summoning-key`,
    link: 'Summoning Key',
  },
  {
    title: 'Final Shadowman Fight',
    summary: 'Charge an altar, throw the Summoning Key through ghost S.O.P.H.I.A., push the Shadowman into the Apothicon mouth, then interact with the book to finish.',
  },
];

const MainGuide = () => (
  <main className="rev-page rev-main-guide">
    <div className="rev-background" />
    <div className="rev-main-content">
      <GuideHero
        kicker="Revelations"
        title="For The Good Of All"
        description="Five phases for the whole quest. Use the dedicated pages for location-heavy steps."
      />

      <GuideCallout label="Random step" tone="info" className="rev-main-note">
        The four-symbol order changes every game. Copy the order shown by the book; do not memorize a fixed code.
      </GuideCallout>

      <GuideSection kicker="Main Run" title="Five phases">
        <GuideStepList className="zh-guide-step-list--roadmap">
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

      <div className="rev-main-shortcuts">
        <Link to={`${BASE}/sound-step`}>Sound Step</Link>
        <Link to={`${BASE}/egg-locations`}>Egg Locations</Link>
        <Link to={`${BASE}/summoning-key`}>Summoning Key</Link>
      </div>
    </div>
  </main>
);

export default MainGuide;
