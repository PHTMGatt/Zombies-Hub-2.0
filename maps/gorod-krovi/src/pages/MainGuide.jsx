import React from 'react';
import { Link } from 'react-router-dom';
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

const MainGuide = () => (
  <main className="gorod-main-guide">
    <header className="gorod-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>Love and War</h2>
      </div>
      <p>Four phases. Use the solver and reference tabs only when the run reaches them.</p>
    </header>

    <div className="gorod-run-alert">
      <strong>Before you start:</strong>
      <span>{gorodPrerequisites.join(' ')}</span>
    </div>

    <ol className="gorod-run-flow">
      {phases.map((phase, index) => (
        <li key={phase.title}>
          <span className="gorod-run-number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <Link to={phase.to}>{phase.link} →</Link>
          </div>
        </li>
      ))}
    </ol>
  </main>
);

export default MainGuide;
