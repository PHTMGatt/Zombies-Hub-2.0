import React from 'react';
import { Link } from 'react-router-dom';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import gorodGuideSteps from '../data/gorodGuideSteps';
import '../styles/MainGuideFlat.css';

// Gorod Krovi main guide: the Easter Egg steps in order, one line each. Detail lives on the tabs.
const MainGuide = () => (
  <div className="gorod-main-guide gorod-main-flat">
    <FlatGuide
      label="Love and War"
      steps={gorodGuideSteps}
      footer={(
        <>
          <CompleteEasterEgg mapId="gorod-krovi" />
          <Link className="gorod-main-flat__related" to="/side-easter-eggs/gk">Side Easter Egg video</Link>
        </>
      )}
    />
  </div>
);

export default MainGuide;
