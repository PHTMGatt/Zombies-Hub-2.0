import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import deGuideSteps from '../data/deGuideSteps';
import '../styles/pages/Home.css';
import '../styles/pages/HomeCompact.css';

const QUICK_REFS = [
  { label: "Bow upgrades", stepId: "upgrade-bow" },
  { label: "Shield + Ragnaroks", stepId: "gear" },
  { label: "First wisp cycle", stepId: "first-wisps" },
  { label: "Safe code", stepId: "death-ray-safe" },
  { label: "Keeper ritual", stepId: "keeper-ritual" },
  { label: "Side Easter Egg video", to: "/side-easter-eggs/de" },
];

const Home: React.FC = () => (
  <div className="de-home-page">
    <header className="de-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>My Brother’s Keeper</h2>
      </div>
      <p>Ranked/online: one upgraded bow per player. Local/offline or unranked: all four bows.</p>
    </header>

    <details className="de-run-alert">
      <summary>Before you start</summary>
      <p>Build the Shield / Ragnarok pieces as they become available, and finish your lobby’s bow requirement before the Keeper ritual.</p>
    </details>

    <div className="de-guide">
      <GuideSteps guideId="der-eisendrache" mapId="der-eisendrache" quickRefs={QUICK_REFS} label="My Brother’s Keeper" steps={deGuideSteps} />
    </div>
  </div>
);

export default Home;
