import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import zetsGuideSteps from '../data/zetsGuideSteps';
// Guide.css also carries styles the cog and boss pages share (this route chunk always loads it).
import '../styles/Guide.css';
import '../styles/MainGuideCompact.css';

const QUICK_REFS = [
  { label: 'Shield + Gas Mask parts', stepId: 'bunker' },
  { label: 'KT-4 parts', stepId: 'kt4' },
  { label: 'Masamune ingredients', stepId: 'masamune' },
  { label: 'Cog 2 plant cycle', stepId: 'cog-2' },
  { label: 'Buildables page', to: '/maps/zetsubou-no-shima/buildables' },
];

const MainGuide = () => (
  <div className="zets-main-guide">
    <header className="zets-run-header">
      <h2>Seeds of Doubt</h2>
      <p>Every player must finish all three of their own Trials — Cog 3 depends on it.</p>
    </header>

    <div className="zets-guide">
      <GuideSteps guideId="zetsubou-no-shima" mapId="zetsubou-no-shima" quickRefs={QUICK_REFS} label="Seeds of Doubt" steps={zetsGuideSteps} />
    </div>
  </div>
);

export default MainGuide;
