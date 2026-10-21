import React from 'react';
import { Link } from 'react-router-dom';
import { GuideRun } from '../../../../shared/ui/GuideRun';
import '../styles/pages/HomeCompact.css';

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
    to: `${BASE}/wisps`,
    link: 'Wisp Reference',
  },
  {
    title: 'Second Wisps + Keeper Stone',
    summary: 'Repeat the teleporter/wisp cycle, return to the past, and collect the Keeper Stone for the ritual.',
    to: `${BASE}/wisps`,
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

const theme = {
  accent: '#8fd6ff',
  'accent-2': '#4fb3f0',
  'on-accent': '#06111a',
  text: '#f1f8ff',
  muted: '#cddbe6',
  panel: 'rgba(3, 10, 18, 0.86)',
  line: 'rgba(123, 207, 255, 0.2)',
};

const Home: React.FC = () => (
  <main className="de-run-page">
    <GuideRun
      runId="der-eisendrache"
      title="My Brother’s Keeper"
      intro="Five phases. The detailed bow, wisp, gear, and boss pages stay separate so the main run stays readable."
      alert={{
        label: 'Setup',
        text: 'Build the Shield/Ragnarok pieces as they become available and finish the bow requirement for your lobby before the Keeper ritual.',
      }}
      phases={phases}
      theme={theme}
    >
      <h3 className="zh-run__extras-title">Quick references</h3>
      <nav className="zh-run__shortcuts" aria-label="Der Eisendrache focused guides">
        <Link to={`${BASE}/bows`}>Bows <span>Base + four upgrades</span></Link>
        <Link to={`${BASE}/wisps`}>Wisps <span>Both cycles + locations</span></Link>
        <Link to={`${BASE}/parts`}>Gear <span>Shield + Ragnarok DG-4</span></Link>
        <Link to={`${BASE}/boss`}>Boss <span>Keeper fight + ending</span></Link>
      </nav>
    </GuideRun>
  </main>
);

export default Home;
