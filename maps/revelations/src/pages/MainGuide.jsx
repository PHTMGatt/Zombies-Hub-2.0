import React from 'react';
import { Link } from 'react-router-dom';
import { GuideRun } from '../../../../shared/ui/GuideRun';
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

const theme = {
  accent: '#8fd2ff',
  'accent-2': '#5aa9f5',
  'on-accent': '#06111f',
  text: '#f2f8ff',
  muted: '#cfdcea',
  panel: 'rgba(5, 10, 22, 0.86)',
  line: 'rgba(109, 194, 255, 0.22)',
};

const MainGuide = () => (
  <main className="rev-page rev-main-guide">
    <div className="rev-background" />
    <GuideRun
      runId="revelations"
      title="For The Good Of All"
      intro="Five phases. Open the location tools only when you need them."
      alert={{
        label: 'Random symbol step',
        text: 'Copy the four symbols shown by the book each game—there is no fixed code.',
      }}
      phases={phases}
      theme={theme}
    >
      <h3 className="zh-run__extras-title">Quick references</h3>
      <nav className="zh-run__shortcuts" aria-label="Revelations quick references">
        <Link to={`${BASE}/sound-step`}>Sound Step</Link>
        <Link to={`${BASE}/egg-locations`}>Egg Locations</Link>
        <Link to={`${BASE}/summoning-key`}>Summoning Key</Link>
        <Link to={`${BASE}/apothicon-upgrade`}>Apothicon Upgrade</Link>
      </nav>
    </GuideRun>
  </main>
);

export default MainGuide;
