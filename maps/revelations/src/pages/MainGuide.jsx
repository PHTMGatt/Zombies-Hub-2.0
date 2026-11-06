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
          <span className="rev-run-header__kicker">THE FINAL CHAPTER / EASTER EGG</span>
          <h2>For The Good Of All</h2>
          <p>Twelve objectives through the broken worlds. The original in-game screenshots and references remain right in the steps.</p>
        </div>
        <div className="rev-run-header__count" aria-label="12 guide steps">
          <strong>12</strong>
          <span>OBJECTIVES</span>
        </div>
      </header>

      <nav className="rev-run-chapters" aria-label="Jump to a Revelations guide chapter">
        <a href="#engines"><span className="rev-run-chapters__number">I · 01—03</span><strong>The opening</strong><span className="rev-run-chapters__hint">Engines &amp; Servant</span></a>
        <a href="#reel-1"><span className="rev-run-chapters__number">II · 04—06</span><strong>The rituals</strong><span className="rev-run-chapters__hint">All three reels</span></a>
        <a href="#sophia"><span className="rev-run-chapters__number">III · 07—10</span><strong>The Kronorium</strong><span className="rev-run-chapters__hint">S.O.P.H.I.A. &amp; symbols</span></a>
        <a href="#throws"><span className="rev-run-chapters__number">IV · 11—12</span><strong>The finale</strong><span className="rev-run-chapters__hint">Key throws &amp; Shadowman</span></a>
      </nav>

      <div className="rev-guide">
        <GuideSteps label="For The Good Of All" steps={revGuideSteps} footer={<CompleteEasterEgg mapId="revelations" />} />
      </div>
    </div>
  </div>
);

export default MainGuide;
