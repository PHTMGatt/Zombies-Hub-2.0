import React, { useState } from 'react';
import apothiconSteps from '../data/ApothiconSteps';
import '../styles/MainGuide.css';

const MainGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const current = apothiconSteps[currentStep];

  // Highlight (2-3-1-4) in Tombstones step only
  const renderDetail = (step) => {
    if (step.title === 'Tombstones') {
      const [before, after] = step.detail.split('(2-3-1-4)');
      return (
        <>
          {before}
          <span className="rev-code">(2–3–1–4)</span>
          {after}
        </>
      );
    }
    return step.detail;
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />

      {/* Top Title + Description */}
      <div className="rev-intro-section">
        <h1 className="rev-title">For The Good Of All</h1>
        <p className="rev-description">
          This is the final Easter Egg in Revelations. Complete the steps to summon S.O.P.H.I.A. and defeat the Shadowman.
          Unlocks <strong>“For The Good Of All”</strong>. Completing all prior EEs grants <em>“A Better Tomorrow.”</em>
        </p>
      </div>

      {/* Step Layout */}
      <div className="rev-grid-split">
        {/* LEFT SIDE - NAV */}
        <div className="rev-step-list">
          {apothiconSteps.map((step, index) => (
            <button
              key={index}
              className={`rev-step-button ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            >
              <span className="rev-step-number">{index + 1}.</span> {step.title}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE - STEP */}
        <div className="rev-step-panel">
          <div className="rev-step-detail">
            <h2 className="rev-step-title">{current.title}</h2>
            <p className="rev-step-text">{renderDetail(current)}</p>
          </div>
        
          <div className="rev-step-extra">
  <h3 className="tip-header">Advanced EE Tips</h3>

  <ul className="tip-list">
    <li>
      Do all 9 Arnie throws during a <span className="rev-keyword">bug round</span>, then kill every Parasite.
      This will end the round and instantly wipe all 3 Margwas. 
      <span className="rev-note"> (High-skill strat — clears the Margwa step fast if done clean.)</span>
    </li>
    <li>
      Use <span className="rev-code">Raindrops</span> to spawn 2 Max Ammos — clutch for finishing all 9 throws in one go.
    </li>
    <li>
      Build the shield next to <span className="rev-keyword">Jug</span> for fast access during the boss fight.
    </li>
    <li>
      Grab your masks early. <span className="rev-keyword">God Mask</span> takes ~2 hours, so plan around it.
    </li>
    <li>
      Always <span className="rev-keyword">save a zombie</span> after each step to prevent accidental round skips.
    </li>
  </ul>
</div>



        </div>
      </div>
    </div>
  );
};

export default MainGuide;
