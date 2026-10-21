import React from 'react';
import { GuideRun } from '../../../../shared/ui/GuideRun';
import { gorodPrerequisites } from '../data/gorodRun';
import '../styles/MainGuide.css';

const BASE = '/maps/gorod-krovi';

const phases = [
  {
    title: 'Open the Dragon Network',
    summary: 'Turn on power, finish the three Groph Modules, install the Dragon Network parts, ride the dragon, earn Dragon Strike, and complete the dragon-egg/Gauntlet setup.',
    to: `${BASE}/buildables`,
    link: 'Gear + Buildables',
  },
  {
    title: 'Solve Valves + Spell KRONOS',
    summary: 'Use the randomized valve solution to release the Master Code Cylinder, insert it at S.O.P.H.I.A., then rotate the letter wheels to spell KRONOS.',
    to: `${BASE}/valves`,
    link: 'Valve Solver',
  },
  {
    title: 'Trophies + S.O.P.H.I.A. Challenges',
    summary: 'Collect all six trophies, place them at Dragon Command, then complete the randomized challenge set and final motherboard lockdown.',
    to: `${BASE}/trophies`,
    link: 'Trophies + Challenges',
  },
  {
    title: 'Power Core + Boss Fight',
    summary: 'Take S.O.P.H.I.A.’s Power Core, open the boss route, kill the dragon, then destroy Nikolai’s mech weak points to finish Love and War.',
    to: `${BASE}/boss`,
    link: 'Boss Fight',
  },
];

const theme = {
  accent: '#ff8a63',
  'accent-2': '#ff5a32',
  'on-accent': '#1b0904',
  text: '#fff4ee',
  muted: '#e6d0c6',
  panel: 'rgba(22, 8, 5, 0.86)',
  line: 'rgba(255, 112, 77, 0.22)',
};

const MainGuide = () => (
  <main className="gorod-main-guide">
    <GuideRun
      runId="gorod-krovi"
      title="Love and War"
      intro="Four phases. Use the solver and reference tabs only when the run reaches them."
      alert={{ label: 'Before you start', text: gorodPrerequisites.join(' ') }}
      phases={phases}
      theme={theme}
    />
  </main>
);

export default MainGuide;
