import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import apothiconSteps from '../data/ApothiconSteps';
import RevSectionHeader from '../components/RevSectionHeader';
import '../styles/MainGuide.css';

const BASE = '/maps/revelations';

const referenceLinks = {
  2: { to: `${BASE}/apothicon-upgrade`, label: 'Open Apothicon Upgrade' },
  7: { to: `${BASE}/egg-locations`, label: 'Open Egg Locations' },
  8: { to: `${BASE}/sound-step`, label: 'Open Rune / Sound Reference' },
  10: { to: `${BASE}/summoning-key`, label: 'Open Summoning Key Throws' },
};

const pad = (value) => String(value).padStart(2, '0');

const MainGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const firstRender = useRef(true);

  const total = apothiconSteps.length;
  const current = apothiconSteps[currentStep];
  const previous = apothiconSteps[currentStep - 1];
  const next = apothiconSteps[currentStep + 1];
  const reference = referenceLinks[currentStep];

  const goTo = (index) => setCurrentStep(Math.max(0, Math.min(total - 1, index)));

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Phones: the step chips are a swipeable row; keep the current chip centered (row only, never the page).
    const list = listRef.current;
    const active = list?.querySelector('.rev-step-button.active');
    if (list && active && list.scrollWidth > list.clientWidth) {
      const listBox = list.getBoundingClientRect();
      const activeBox = active.getBoundingClientRect();
      list.scrollLeft += activeBox.left - listBox.left - (listBox.width - activeBox.width) / 2;
    }

    // After Previous/Next from the bottom of a long step, bring the new step's start back into view.
    const panel = panelRef.current;
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hub-nav-height')) || 0;
    if (panel && panel.getBoundingClientRect().top < navHeight) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [currentStep]);

  return (
    <div className="rev-page rev-main-guide">
      <section className="rev-shell">
        <RevSectionHeader
          kicker="Main Easter Egg"
          title="For The Good Of All"
          intro={`${total} steps. Pick the one you are on — only that part of the run opens, so the guide stays fast and readable.`}
        />

        <div className="rev-guide-grid">
          <nav className="rev-step-list" aria-label="Revelations Easter Egg steps">
            <ol ref={listRef} style={{ '--rev-progress': currentStep / (total - 1) }}>
              {apothiconSteps.map((step, index) => {
                const state = index < currentStep ? 'past' : index === currentStep ? 'current' : 'next';
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      className={`rev-step-button${index === currentStep ? ' active' : ''}`}
                      data-state={state}
                      aria-current={index === currentStep ? 'step' : undefined}
                      onClick={() => goTo(index)}
                    >
                      <span className="rev-step-button__num">{pad(index + 1)}</span>
                      <strong className="rev-step-button__title">{step.title}</strong>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <article className="rev-step-panel" ref={panelRef}>
            <div className="rev-step-progress" aria-hidden="true">
              <span style={{ width: `${((currentStep + 1) / total) * 100}%` }} />
            </div>

            <div className="rev-step-meta">
              <span className="rev-step-meta__step">Step {pad(currentStep + 1)}</span>
              <span className="rev-step-meta__count">{currentStep + 1} / {total}</span>
            </div>

            <h3>{current.title}</h3>
            <p className="rev-step-detail">{current.detail}</p>

            {current.bullets?.length > 0 && (
              <div className="rev-step-notes">
                <span className="rev-kicker">Key details</span>
                <ul className="rev-step-bullets">
                  {current.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            )}

            {reference && (
              <Link className="rev-step-reference" to={reference.to}>
                {reference.label} <span aria-hidden="true">→</span>
              </Link>
            )}

            <div className="rev-step-controls">
              <button
                type="button"
                className="rev-step-nav rev-step-nav--prev"
                aria-label="Previous step"
                onClick={() => goTo(currentStep - 1)}
                disabled={!previous}
              >
                <span className="rev-step-nav__dir">← Previous</span>
                <span className="rev-step-nav__title">{previous ? previous.title : 'Start of the run'}</span>
              </button>
              <button
                type="button"
                className="rev-step-nav rev-step-nav--next"
                aria-label="Next step"
                onClick={() => goTo(currentStep + 1)}
                disabled={!next}
              >
                <span className="rev-step-nav__dir">Next →</span>
                <span className="rev-step-nav__title">{next ? next.title : 'Final step'}</span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default MainGuide;
