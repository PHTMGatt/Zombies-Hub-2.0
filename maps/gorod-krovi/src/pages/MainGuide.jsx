import React from 'react';
import { Link } from 'react-router-dom';
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
