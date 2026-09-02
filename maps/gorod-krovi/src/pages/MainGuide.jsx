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
import { gorodPrerequisites } from '../data/gorodRun';
import '../styles/MainGuide.css';

const BASE = '/maps/gorod-krovi';

const phases = [
  {
    title: 'Open the Dragon Network',
    summary: 'Turn on power, finish the three Groph Modules, install the Dragon Network parts, ride the dragon, earn Dragon Strike, and complete the dragon-egg/Gauntlet setup.',
    to: `${BASE}/buildables`,
    link: 'Open Gear + Buildables',
  },
  {
    title: 'Solve Valves + Spell KRONOS',
    summary: 'Use the randomized valve solution to release the Master Code Cylinder, insert it at S.O.P.H.I.A., then rotate the letter wheels to spell KRONOS.',
    to: `${BASE}/valves`,
    link: 'Open Valve Solver',
  },
  {
    title: 'Trophies + S.O.P.H.I.A. Challenges',
    summary: 'Collect all six trophies, place them at Dragon Command, then complete the randomized challenge set and final motherboard lockdown.',
    to: `${BASE}/trophies`,
    link: 'Open Trophies + Challenges',
  },
  {
    title: 'Power Core + Boss Fight',
    summary: 'Take S.O.P.H.I.A.’s Power Core, open the boss route, kill the dragon, then destroy Nikolai’s mech weak points to finish Love and War.',
    to: `${BASE}/boss`,
    link: 'Open Boss Guide',
  },
];

const MainGuide = () => (
  <main className="gorod-main-guide">
    <GuideHero
      kicker="Gorod Krovi"
      title="Love and War"
      description="Four major phases. Use the focused pages for valves, trophies, buildables, and the boss instead of scrolling through the whole quest."
    >
      <GuideChip>Solo + Co-op</GuideChip>
      <GuideChip>Stalingrad</GuideChip>
    </GuideHero>

    <GuideCallout label="Before you start" tone="info" className="gorod-guide-note">
      {gorodPrerequisites.join(' ')}
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
            <Link className="gorod-phase-link" to={phase.to}>{phase.link} →</Link>
          </GuideStepCard>
        ))}
      </GuideStepList>
    </GuideSection>
  </main>
);

export default MainGuide;
