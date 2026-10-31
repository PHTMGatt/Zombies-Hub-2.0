import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import zetsGuideSteps from '../data/zetsGuideSteps';
// Guide.css also carries styles the cog and boss pages share (this route chunk always loads it).
import '../styles/Guide.css';
import '../styles/MainGuideCompact.css';

const MainGuide = () => (
  <div className="zets-main-guide">
    <header className="zets-run-header">
      <h2>Seeds of Doubt</h2>
      <p>Every player must finish all three of their own Trials — Cog 3 depends on it.</p>
    </header>

    <div className="zets-guide">
      <GuideSteps label="Seeds of Doubt" steps={zetsGuideSteps} footer={<CompleteEasterEgg mapId="zetsubou-no-shima" />} />
    </div>
  </div>
);

export default MainGuide;
