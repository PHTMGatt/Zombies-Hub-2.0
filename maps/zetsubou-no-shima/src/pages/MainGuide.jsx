import React from 'react';
import { Link } from 'react-router-dom';
import { GuideRun } from '../../../../shared/ui/GuideRun';
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

const theme = {
  accent: '#7cebb8',
  'accent-2': '#3fcf8f',
  'on-accent': '#032116',
  text: '#effff7',
  muted: '#c9e6d8',
  panel: 'rgba(4, 16, 11, 0.86)',
  line: 'rgba(105, 230, 173, 0.2)',
};

const MainGuide = () => (
  <main className="zets-run-page">
    <GuideRun
      runId="zetsubou-no-shima"
      title="Seeds of Doubt"
      intro="Four phases. Keep the buildables and cog pages as quick references, not extra reading."
      alert={{
        label: 'Do early',
        text: 'Finish all three Trials, keep a bucket moving, and have Anywhere But Here! available before the cog phase.',
      }}
      phases={phases}
      theme={theme}
    >
      <h3 className="zh-run__extras-title">Quick references</h3>
      <nav className="zh-run__shortcuts" aria-label="Zetsubou quick references">
        <Link to={`${BASE}/buildables`}>Buildables + KT-4</Link>
        <Link to={`${BASE}/extras`}>Rewards + Extras</Link>
      </nav>
    </GuideRun>
  </main>
);

export default MainGuide;
