import React from 'react';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

const MainGuide = () => (
  <div className="rev-page rev-main-guide">
    <div className="rev-run">
      <header className="rev-run-header">
        <div className="rev-run-header__identity">
          <span className="rev-run-header__kicker">THE MAIN EASTER EGG · 12 STEPS</span>
          <h2>For The Good Of All</h2>
          <p>Twelve steps across every old map. Screenshots show where to aim.</p>
        </div>

      </header>

      <nav className="rev-run-chapters" aria-label="Jump to a Revelations guide chapter">
        <a href="#engines"><span className="rev-run-chapters__number">01—03</span><strong>Setup</strong></a>
        <a href="#reel-1"><span className="rev-run-chapters__number">04—06</span><strong>Reels</strong></a>
        <a href="#sophia"><span className="rev-run-chapters__number">07—10</span><strong>Kronorium</strong></a>
        <a href="#throws"><span className="rev-run-chapters__number">11—12</span><strong>Finale</strong></a>
      </nav>

      <div className="rev-guide">
        <GuideSteps label="For The Good Of All" steps={revGuideSteps} presentation="runbook" footer={<CompleteEasterEgg mapId="revelations" />} />
      </div>
    </div>
  </div>
);

export default MainGuide;
