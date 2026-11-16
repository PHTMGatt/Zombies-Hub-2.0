import React from 'react';
import { Link } from 'react-router-dom';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import deGuideSteps from '../data/deGuideSteps';
import '../styles/pages/Home.css';
import '../styles/pages/HomeFlat.css';

// Der Eisendrache main guide: the Easter Egg steps in order, one line each. Detail lives on the tabs.
const Home: React.FC = () => (
  <div className="de-home-page de-home-flat">
    <FlatGuide
      label="My Brother’s Keeper"
      steps={deGuideSteps}
      footer={(
        <>
          <CompleteEasterEgg mapId="der-eisendrache" />
          <Link className="de-home-flat__related" to="/side-easter-eggs/de">Side Easter Egg video</Link>
        </>
      )}
    />
  </div>
);

export default Home;
