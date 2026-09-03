import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';

const BASE = '/maps/der-eisendrache';

const phases = [
  {
    title: 'Wrath of the Ancients + Bow',
    summary: 'Feed all three dragons, collect the base bow, then finish the elemental upgrade your lobby needs.',
    to: `${BASE}/bows`,
    link: 'Bow Guides',
  },
  {
    title: 'First Wisps + Safe Sequence',
    summary: 'Prime the teleporter, complete the first four-wisp cycle, time travel for the canister/fuses/safe code, then finish the Death Ray safe and both Simon Says terminals.',
    to: `${BASE}/wisp`,
    link: 'Wisp Reference',
  },
  {
    title: 'Second Wisps + Keeper Stone',
    summary: 'Repeat the teleporter/wisp cycle, return to the past, and collect the Keeper Stone for the ritual.',
    to: `${BASE}/wisp`,
    link: 'Second Wisp Cycle',
  },
  {
    title: 'Keeper Ritual + MPD',
    summary: 'Summon the ghost Keeper, charge all four ritual circles with the requested bows, insert the Soul Canister, finish every Ragnarok, and prepare the Pyramid tiles.',
    to: `${BASE}/parts`,
    link: 'Gear + Ragnaroks',
  },
  {
    title: 'Keeper Boss + Ending',
    summary: 'Enter the arena, use Ragnarok stuns for the three Keeper damage windows, clear the Panzer waves, then take the Summoning Key to the Clock Tower terminal.',
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
      <strong>Setup:</strong>
      <span>build the Shield/Ragnarok pieces as they become available and finish the bow requirement for your lobby before the Keeper ritual.</span>
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
