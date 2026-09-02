import React, { useState } from 'react';
import apothiconSteps from '../data/ApothiconSteps';
import '../styles/MainGuide.css';

const MainGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const current = apothiconSteps[currentStep];

  const renderDetail = (step) => {
    if (step.title.startsWith('Tombstones')) {
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
    <main className="rev-page rev-main-guide">
      <div className="rev-background" />

      <div className="rev-intro-section">
        <span className="rev-main-kicker">Revelations · Black Ops III</span>
        <h1 className="rev-title">For The Good Of All</h1>
        <p className="rev-description">
          A run-first version of the full Revelations quest. Use the left side as your progression checklist,
          then open only the step you are currently doing for the details that matter in-game.
        </p>
        <div className="rev-main-chips" aria-label="Guide requirements">
          <span>Apothicon Servant</span>
          <span>Little Arnies</span>
          <span>Keeper Protector</span>
          <span>4 Runes</span>
        </div>
      </div>

      <div className="rev-grid-split">
        <nav className="rev-step-list" aria-label="Revelations Easter Egg progression">
          <span className="rev-step-list__label">Quest Progression</span>
          {apothiconSteps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className={`rev-step-button ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <span className="rev-step-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{step.title}</span>
            </button>
          ))}
        </nav>

        <section className="rev-step-panel" aria-live="polite">
          <article className="rev-step-detail">
            <div className="rev-step-heading-row">
              <span className="rev-step-current">Step {currentStep + 1} of {apothiconSteps.length}</span>
              <span className="rev-step-status">Main Quest</span>
            </div>
            <h2 className="rev-step-title">{current.title}</h2>
            <p className="rev-step-text">{renderDetail(current)}</p>

            {Array.isArray(current.bullets) && current.bullets.length > 0 && (
              <ul className="rev-step-checklist">
                {current.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>

          <aside className="rev-step-extra">
            <h3 className="tip-header">Run Notes</h3>
            <ul className="tip-list">
              <li>
                The <span className="rev-keyword">Thunder Gun</span> is optional, but the walkthrough specifically recommends it for making the Margwa phases much easier.
              </li>
              <li>
                For the nine Little Arnie holes, a <span className="rev-keyword">bug round</span> plus Raindrops can make the ammo-heavy step substantially faster.
              </li>
              <li>
                A <span className="rev-keyword">Pack-a-Punched bullet weapon</span> is required to reveal the six bone rocks before the upgraded Apothicon Servant absorbs them.
              </li>
              <li>
                The four-symbol order in the boss room is <span className="rev-code">random every game</span>; copy the order shown by the book instead of memorizing a fixed solution.
              </li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default MainGuide;
