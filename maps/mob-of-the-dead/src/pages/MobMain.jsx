import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import { mobPrerequisites } from '../data/mobGuide';
import mobGuideSteps from '../data/mobGuideSteps';
import '../styles/MobMain.css';

const MobMain = () => (
  <div className="mobmain-page">
    <header className="mob-run-header">
      <h2>Pop Goes the Weasel</h2>
      <p>Original difficulty only. Solo can go as far as the final flight; the finale needs two or more players.</p>
    </header>

    <details className="mob-run-alert">
      <summary>Before you start</summary>
      <ul>{mobPrerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
    </details>

    <div className="mob-guide">
      <GuideSteps guideId="mob-of-the-dead" label="Pop Goes the Weasel" steps={mobGuideSteps} />
    </div>
  </div>
);

export default MobMain;
