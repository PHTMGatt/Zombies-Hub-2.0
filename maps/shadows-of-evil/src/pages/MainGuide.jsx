import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import soeGuideSteps from '../data/soeGuideSteps';
import '../styles/Shadows.css';
import '../styles/MainGuide.css';

const QUICK_REFS = [
  { label: 'Train symbols + rituals', stepId: 'rituals' },
  { label: 'Your Keeper + Margwa spots', stepId: 'upgrade' },
  { label: 'Flag order', stepId: 'flag' },
  { label: 'Four-player team setup', stepId: 'finale' },
];

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
          <GuideSteps guideId="shadows-of-evil" mapId="shadows-of-evil" quickRefs={QUICK_REFS} label="Shadows of Evil" steps={soeGuideSteps} />
        </div>
      </div>
    </div>
  );
}

export default MainGuide;
