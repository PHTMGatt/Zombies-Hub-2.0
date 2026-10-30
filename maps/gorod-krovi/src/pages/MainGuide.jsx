import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import gorodGuideSteps from '../data/gorodGuideSteps';
import { gorodPrerequisites } from '../data/gorodRun';
import '../styles/MainGuide.css';

const QUICK_REFS = [
  { label: 'Valve Solver', stepId: 'valves' },
  { label: 'Trophy locations', stepId: 'trophies' },
  { label: 'S.O.P.H.I.A. challenges', stepId: 'challenges' },
  { label: 'Code cylinder terminals', stepId: 'dragon-network' },
  { label: 'Shield parts', stepId: 'shield' },
  { label: 'Buildables page', to: '/maps/gorod-krovi/buildables' },
];

const MainGuide = () => (
  <div className="gorod-main-guide">
    <header className="gorod-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>Love and War</h2>
      </div>
      <p>Eleven steps from the Dragon Shield to Nikolai. The Group 935 keycard lockdown is always the last S.O.P.H.I.A. challenge.</p>
    </header>

    <details className="gorod-run-alert">
      <summary>Before you start</summary>
      <ul>{gorodPrerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
    </details>

    <div className="gorod-guide">
      <GuideSteps guideId="gorod-krovi" mapId="gorod-krovi" quickRefs={QUICK_REFS} label="Love and War" steps={gorodGuideSteps} />
    </div>
  </div>
);

export default MainGuide;
