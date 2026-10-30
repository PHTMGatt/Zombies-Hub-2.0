import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import gorodGuideSteps from '../data/gorodGuideSteps';
import { gorodPrerequisites } from '../data/gorodRun';
import '../styles/MainGuide.css';

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
      <GuideSteps guideId="gorod-krovi" label="Love and War" steps={gorodGuideSteps} />
    </div>
  </div>
);

export default MainGuide;
