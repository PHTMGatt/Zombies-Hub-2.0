import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import soeGuideSteps from '../data/soeGuideSteps';
import '../styles/Shadows.css';
import '../styles/MainGuide.css';

function MainGuide() {
  return (
    <div className="soe-page">
      <div className="soe-page__background" aria-hidden="true" />
      <div className="soe-page__content soe-run-sheet">
        <header className="soe-run-header">
          <h2>Shadows of Evil</h2>
          <p>Solo can defeat the Shadowman; the final train sequence and full ending require four players.</p>
        </header>

        <div className="soe-guide">
          <GuideSteps label="Shadows of Evil" steps={soeGuideSteps} footer={<CompleteEasterEgg mapId="shadows-of-evil" />} />
        </div>
      </div>
    </div>
  );
}

export default MainGuide;
