import React from 'react';
import { Link } from 'react-router-dom';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
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
      <p>Ranked/online: one upgraded bow per player. Local/offline or unranked: all four bows.</p>
    </header>

    <details className="de-run-alert">
      <summary>Before you start</summary>
      <p>Build the Shield / Ragnarok pieces as they become available, and finish your lobby’s bow requirement before the Keeper ritual.</p>
    </details>

    <div className="de-guide">
      <GuideSteps label="My Brother’s Keeper" steps={deGuideSteps} footer={(
          <>
            <CompleteEasterEgg mapId="der-eisendrache" />
            <Link className="guide-seq__related" to="/side-easter-eggs/de">Side Easter Egg video</Link>
          </>
        )} />
    </div>
  </div>
);

export default Home;
