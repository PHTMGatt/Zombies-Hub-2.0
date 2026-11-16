import React from 'react';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

// Revelations main guide: the twelve Easter Egg steps in order, one line each. Detail lives on the tabs.
export default function MainGuide() {
  return (
    <div className="rev-page rev-main-guide">
      <section className="rev-run" aria-label="For The Good Of All">
        <FlatGuide label="For The Good Of All" steps={revGuideSteps} footer={<CompleteEasterEgg mapId="revelations" />} />
      </section>
    </div>
  );
}
