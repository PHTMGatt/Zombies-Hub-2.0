import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apothiconSteps from '../data/ApothiconSteps';
import '../styles/MainGuide.css';

const BASE = '/maps/revelations';

const referenceLinks = {
  2: { to: `${BASE}/apothicon-upgrade`, label: 'Open Apothicon Upgrade' },
  7: { to: `${BASE}/egg-locations`, label: 'Open Egg Locations' },
  8: { to: `${BASE}/sound-step`, label: 'Open Rune / Sound Reference' },
  10: { to: `${BASE}/summoning-key`, label: 'Open Summoning Key Throws' },
};

const MainGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const current = apothiconSteps[currentStep];
  const reference = useMemo(() => referenceLinks[currentStep], [currentStep]);

  const goTo = (next) => {
    const max = apothiconSteps.length - 1;
    setCurrentStep(Math.max(0, Math.min(max, next)));
  };

  return (
    <main className="rev-page rev-main-guide">
      <div className="rev-background" />

      <section className="rev-main-shell">
        <header className="rev-main-intro">
          <div>
            <span className="rev-main-kicker">MAIN EASTER EGG</span>
            <h2>For The Good Of All</h2>
          </div>
          <p>Pick the step you are on. Only that part of the run opens, so the guide stays fast and readable.</p>
        </header>

        <div className="rev-main-grid">
          <nav className="rev-step-list" aria-label="Revelations Easter Egg steps">
            {apothiconSteps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`rev-step-button${index === currentStep ? ' active' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.title}</strong>
              </button>
            ))}
          </nav>

          <article className="rev-step-panel">
            <div className="rev-step-meta">
              <span>STEP {String(currentStep + 1).padStart(2, '0')}</span>
              <span>{currentStep + 1} / {apothiconSteps.length}</span>
            </div>

            <h3>{current.title}</h3>
            <p className="rev-step-detail">{current.detail}</p>

            {current.bullets?.length > 0 && (
              <ul className="rev-step-bullets">
                {current.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}

            {reference && (
              <Link className="rev-step-reference" to={reference.to}>{reference.label} →</Link>
            )}

            <div className="rev-step-controls">
              <button type="button" onClick={() => goTo(currentStep - 1)} disabled={currentStep === 0}>← Previous</button>
              <button type="button" onClick={() => goTo(currentStep + 1)} disabled={currentStep === apothiconSteps.length - 1}>Next →</button>
            </div>
          </article>
        </div>

        <nav className="rev-main-shortcuts" aria-label="Revelations quick references">
          <Link to={`${BASE}/apothicon-upgrade`}>Apothicon Upgrade</Link>
          <Link to={`${BASE}/egg-locations`}>Egg Locations</Link>
          <Link to={`${BASE}/summoning-key`}>Summoning Key</Link>
          <Link to={`${BASE}/sound-step`}>Rune / Sound Reference</Link>
        </nav>
      </section>
    </main>
  );
};

export default MainGuide;
