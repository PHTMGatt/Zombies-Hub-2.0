import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import deGuideSteps from '../data/deGuideSteps';
import '../styles/pages/Home.css';
import '../styles/pages/HomeCompact.css';

const Home: React.FC = () => (
  <div className="de-home-page">
    <header className="de-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>My Brother’s Keeper</h2>
      </div>
      <p>Twelve steps. Quick for the reference, Walkthrough for the how-to.</p>
    </header>

    <div className="de-run-alert">
      <strong>Setup:</strong>
      <span>build the Shield/Ragnarok pieces as they become available and finish the bow requirement for your lobby — ranked/online: one upgraded bow per player; local/offline or unranked: all four bows — before the Keeper ritual.</span>
    </div>

    <div className="de-guide">
      <GuideSteps guideId="der-eisendrache" mapId="der-eisendrache" label="My Brother’s Keeper" steps={deGuideSteps} />
    </div>
  </div>
);

export default Home;
