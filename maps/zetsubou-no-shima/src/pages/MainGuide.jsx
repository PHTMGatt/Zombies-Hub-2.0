import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Guide.css';
import '../styles/MainGuideCompact.css';

const BASE = '/maps/zetsubou-no-shima';

const phases = [
  {
    title: 'Setup the Map',
    summary: 'Finish your three Trials, clean all four skulls, open the bunker/Pack-a-Punch, build the gas mask and Shield, then build the KT-4.',
    to: `${BASE}/prerequisites`,
    link: 'Setup Checklist',
  },
  {
    title: 'Skull + Masamune + Elevator',
    summary: 'Use the Skull of Nan Sapwe to reveal the hidden elevator machinery, then finish the KT-4 upgrade into the Masamune.',
    to: `${BASE}/reveal-blueprint`,
    link: 'Elevator Setup',
  },
  {
    title: 'Collect the Three Cogs',
    summary: 'Get the Anywhere But Here! cog, shoot down the plane with the AA cannon, then use the electrified zipline for the final cog.',
    to: `${BASE}/cogs`,
    link: 'Cog Guide',
  },
  {
    title: 'Descend + Kill the Giant Thrasher',
    summary: 'Install all three cogs, take a fresh gas mask and the Masamune into the elevator, then complete the Thrasher boss fight.',
    to: `${BASE}/elevator-battle`,
    link: 'Boss Fight',
  },
];

const MainGuide = () => (
  <main className="zets-main-guide">
    <header className="zets-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>Seeds of Doubt</h2>
      </div>
      <p>Four phases. Keep the buildables and cog pages as quick references, not extra reading.</p>
    </header>

    <div className="zets-run-alert">
      <strong>Do early:</strong>
      <span>finish all three Trials, keep a bucket moving, and have Anywhere But Here! available before the cog phase.</span>
    </div>

    <ol className="zets-run-flow">
      {phases.map((phase, index) => (
        <li key={phase.title}>
          <span className="zets-run-number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <Link to={phase.to}>{phase.link} →</Link>
          </div>
        </li>
      ))}
    </ol>

    <nav className="zets-run-shortcuts" aria-label="Zetsubou quick references">
      <Link to={`${BASE}/buildables`}>Buildables + KT-4</Link>
      <Link to={`${BASE}/extras`}>Rewards + Extras</Link>
    </nav>
  </main>
);

export default MainGuide;
