import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainGuide.css';

const BASE = '/maps/revelations';

const phases = [
  {
    title: 'Open Pack-a-Punch + Prepare',
    summary: 'Tombstones 2 → 3 → 1 → 4. Activate all four Corruption Engines, open the Giant Apothicon, build the Keeper Protector, then finish your weapon setup.',
    to: `${BASE}/apothicon-upgrade`,
    link: 'Apothicon Upgrade',
  },
  {
    title: 'Collect the Three Audio Reels',
    summary: 'Keeper ritual → nine Little Arnie holes → six-bone sequence. Finish each route and place the three reels as you go.',
  },
  {
    title: 'S.O.P.H.I.A. + Eggs + Runes',
    summary: 'Hit the four turret rocks, activate S.O.P.H.I.A., collect the Kronorium, charge four eggs into Gateworms, then locate the four Runes of Creation.',
    to: `${BASE}/egg-locations`,
    link: 'Egg Locations',
  },
  {
    title: 'Symbols + Summoning Key',
    summary: 'Copy the random four-symbol order, clear the Margwa waves, take the Summoning Key, then hit all seven required targets around the map.',
    to: `${BASE}/summoning-key`,
    link: 'Summoning Key Throws',
  },
  {
    title: 'Finish the Shadowman',
    summary: 'Charge an altar, throw the key through ghost S.O.P.H.I.A., damage the Shadowman into the Apothicon mouth, then interact with the book.',
  },
];

const MainGuide = () => (
  <main className="rev-page rev-main-guide">
    <div className="rev-background" />
    <div className="rev-main-content">
      <header className="rev-run-header">
        <div>
          <span>MAIN EASTER EGG</span>
          <h2>For The Good Of All</h2>
        </div>
        <p>Five phases. Open the location tools only when you need them.</p>
      </header>

      <div className="rev-run-alert">
        <strong>Random symbol step:</strong>
        <span>copy the four symbols shown by the book each game—there is no fixed code.</span>
      </div>

      <ol className="rev-run-flow">
        {phases.map((phase, index) => (
          <li key={phase.title}>
            <span className="rev-run-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="rev-run-copy">
              <h3>{phase.title}</h3>
              <p>{phase.summary}</p>
              {phase.to && <Link to={phase.to}>{phase.link} →</Link>}
            </div>
          </li>
        ))}
      </ol>

      <nav className="rev-main-shortcuts" aria-label="Revelations quick references">
        <Link to={`${BASE}/sound-step`}>Sound Step</Link>
        <Link to={`${BASE}/egg-locations`}>Egg Locations</Link>
        <Link to={`${BASE}/summoning-key`}>Summoning Key</Link>
        <Link to={`${BASE}/apothicon-upgrade`}>Apothicon Upgrade</Link>
      </nav>
    </div>
  </main>
);

export default MainGuide;
