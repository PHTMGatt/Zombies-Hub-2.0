import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

const MainGuide = () => (
  <div className="rev-page rev-main-guide">
    <div className="rev-run">
      <header className="rev-run-header">
        <h2>For The Good Of All</h2>
        <p>Twelve steps across every old map. Screenshots show where to aim.</p>
      </header>

      <div className="rev-guide">
        <GuideSteps label="For The Good Of All" steps={revGuideSteps} />
      </div>
    </div>
  </div>
);

export default MainGuide;
