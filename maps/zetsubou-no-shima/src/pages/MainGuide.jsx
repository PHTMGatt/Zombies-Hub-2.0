import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Guide.css';
import '../styles/MainGuideCompact.css';

const BASE = '/maps/zetsubou-no-shima';

const phases = [
  {
    title: 'Setup the Map',
    summary: '3 Trials → 4 skulls → bunker / Pack-a-Punch → Gas Mask + Shield → KT-4.',
    to: `${BASE}/prerequisites`,
    link: 'Setup Checklist',
  },
  {
    title: 'Skull + Masamune + Elevator',
    summary: 'Use the Skull to reveal the elevator machinery → upgrade KT-4 into the Masamune.',
    to: `${BASE}/reveal-blueprint`,
    link: 'Elevator Setup',
  },
  {
    title: 'Collect the Three Cogs',
    summary: 'Anywhere But Here! cog → AA-cannon plane cog → electrified-zipline cog.',
    to: `${BASE}/cogs`,
    link: 'Cog Guide',
  },
  {
    title: 'Descend + Kill the Giant Thrasher',
    summary: 'Install 3 cogs → take a fresh Gas Mask + Masamune → descend → kill the Giant Thrasher.',
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
