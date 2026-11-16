import React from 'react';
import { Link } from 'react-router-dom';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import soeGuideSteps from '../data/soeGuideSteps';
import '../styles/Shadows.css';
import '../styles/MainGuideFlat.css';

// Shadows of Evil main guide: the Easter Egg steps in order, one line each. Detail lives on the tabs.
function MainGuide() {
  return (
    <div className="soe-page">
      <div className="soe-page__background" aria-hidden="true" />
      <div className="soe-page__content soe-main-flat">
        <FlatGuide
          label="Shadows of Evil"
          steps={soeGuideSteps}
          footer={(
            <>
              <CompleteEasterEgg mapId="shadows-of-evil" />
              <Link className="soe-main-flat__related" to="/side-easter-eggs/soe">Side Easter Egg video</Link>
            </>
          )}
        />
      </div>
    </div>
  );
}

export default MainGuide;
