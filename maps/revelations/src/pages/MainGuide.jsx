import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

// In-guide references only: the section pages are already one tap away in the header.
const QUICK_REFS = [
  { label: 'Servant blue rocks', stepId: 'servant' },
  { label: 'Bone spots', stepId: 'reel-3' },
  { label: 'Kronorium symbol order', stepId: 'symbols' },
  { label: 'Summoning Key targets', stepId: 'throws' },
  { label: 'Tombstones + engines', stepId: 'engines' },
];

const MainGuide = () => (
  <div className="rev-page rev-main-guide">
    <div className="rev-run">
      <header className="rev-run-header">
        <h2>For The Good Of All</h2>
        <p>Twelve steps across every old map. Screenshots show where to aim.</p>
      </header>

      <div className="rev-guide">
        <GuideSteps guideId="revelations" mapId="revelations" quickRefs={QUICK_REFS} label="For The Good Of All" steps={revGuideSteps} />
      </div>
    </div>
  </div>
);

export default MainGuide;
