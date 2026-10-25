import React from 'react';
import { GuideRun } from '../../../../shared/ui/GuideRun';
import { gorodPrerequisites } from '../data/gorodRun';
import '../styles/MainGuide.css';

const BASE = '/maps/gorod-krovi';

const phases = [
  {
    title: 'Open the Dragon Network',
    summary: 'Power → 3 Groph Modules → Dragon Network → ride the dragon → Dragon Strike → egg / Gauntlet setup.',
    to: `${BASE}/buildables`,
    link: 'Gear + Buildables',
  },
  {
    title: 'Solve Valves + Spell KRONOS',
    summary: 'Solve the valves → release the Master Code Cylinder → insert it at S.O.P.H.I.A. → spell KRONOS.',
    to: `${BASE}/valves`,
    link: 'Valve Solver',
  },
  {
    title: 'Trophies + S.O.P.H.I.A. Challenges',
    summary: 'Collect 6 trophies → place them at Dragon Command → finish S.O.P.H.I.A.’s challenges → motherboard lockdown.',
    to: `${BASE}/trophies`,
    link: 'Trophies + Challenges',
  },
  {
    title: 'Power Core + Boss Fight',
    summary: 'Take the Power Core → open the boss route → kill the dragon → destroy Nikolai’s mech weak points.',
    to: `${BASE}/boss`,
    link: 'Boss Fight',
  },
];

// Saved progress is stored by phase index under zh-run-progress:gorod-krovi,
// so keep this order and count stable once shipped.
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
  <div className="gorod-main-guide">
    <GuideRun
      runId="gorod-krovi"
      title="Love and War"
      intro="Four phases. Use the solver and reference tabs only when the run reaches them."
      alert={{ label: 'Before you start', text: gorodPrerequisites.join(' ') }}
      phases={phases}
      theme={theme}
    />
  </div>
);

export default MainGuide;
