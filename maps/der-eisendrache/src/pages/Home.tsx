import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
import '../styles/pages/HomeCompact.css';

const BASE = '/maps/der-eisendrache';

const phases = [
  {
    title: 'Wrath of the Ancients + Bow',
    summary: 'Feed 3 dragons → get the base bow → finish the elemental upgrade your lobby needs.',
    to: `${BASE}/bows`,
    link: 'Bow Guides',
  },
  {
    title: 'First Wisps + Safe Sequence',
    summary: 'Prime the teleporter → hit 4 wisps → time travel → grab the canister, fuses, and safe code → finish Simon Says.',
    to: `${BASE}/wisp`,
    link: 'Wisp Reference',
  },
  {
    title: 'Second Wisps + Keeper Stone',
    summary: 'Repeat the wisp cycle → time travel again → collect the Keeper Stone.',
    to: `${BASE}/wisp`,
    link: 'Second Wisp Cycle',
  },
  {
    title: 'Keeper Ritual + MPD',
    summary: 'Summon the Keeper → charge all 4 circles → insert the Soul Canister → finish Ragnaroks → prep the Pyramid.',
    to: `${BASE}/parts`,
    link: 'Gear + Ragnaroks',
  },
  {
    title: 'Keeper Boss + Ending',
    summary: 'Enter the arena → stun the Keeper with Ragnaroks → clear the Panzer waves → finish at the Clock Tower terminal.',
    to: `${BASE}/boss`,
    link: 'Boss Fight',
  },
];

const Home: React.FC = () => (
  <main className="de-home-page">
    <header className="de-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>My Brother’s Keeper</h2>
      </div>
      <p>Five phases. The detailed bow, wisp, gear, and boss pages stay separate so the main run stays readable.</p>
    </header>

    <div className="de-run-alert">
      <strong>Bow requirement:</strong>
      <span>Ranked/public games need one upgraded bow per player. Unranked/local games require all four. Build the Shield and Ragnarok parts alongside the quest.</span>
    </div>

    <ol className="de-run-flow">
      {phases.map((phase, index) => (
        <li key={phase.title}>
          <span className="de-run-number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <Link to={phase.to}>{phase.link} →</Link>
          </div>
        </li>
      ))}
    </ol>

    <nav className="de-quick-links" aria-label="Der Eisendrache focused guides">
      <Link to={`${BASE}/bows`}>Bows <span>Base + four upgrades</span></Link>
      <Link to={`${BASE}/wisp`}>Wisps <span>Both cycles + locations</span></Link>
      <Link to={`${BASE}/parts`}>Gear <span>Shield + Ragnarok DG-4</span></Link>
      <Link to={`${BASE}/boss`}>Boss <span>Keeper fight + ending</span></Link>
    </nav>
  </main>
);

export default Home;
