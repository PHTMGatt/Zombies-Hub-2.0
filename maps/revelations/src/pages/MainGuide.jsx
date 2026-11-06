import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GuideSteps from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

const padded = (number) => String(number).padStart(2, '0');
const getStepFromHash = (hash) => {
  try { return decodeURIComponent(hash.replace(/^#/, '')); } catch { return ''; }
};

/*
 * The user's original Revelations layout (September 2026):
 * left-hand step selection + ONE focused glass walkthrough at right.
 * Keep today's verified 12-step guide data and in-game captures.
 */
export default function MainGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const railRef = useRef(null);
  const selectedId = getStepFromHash(location.hash);
  const found = revGuideSteps.findIndex((step) => step.id === selectedId);
  const activeIndex = found < 0 ? 0 : found;
  const selected = revGuideSteps[activeIndex];
  const previous = revGuideSteps[activeIndex - 1];
  const next = revGuideSteps[activeIndex + 1];

  const selectStep = (id) => {
    if (id === selected.id && location.hash === `#${id}`) return;
    navigate({ pathname: location.pathname, search: location.search, hash: `#${id}` }, { preventScrollReset: true });
  };

  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector('.rev-step-button[aria-current="step"]');
    if (!rail || !active || rail.scrollWidth <= rail.clientWidth) return;
    const currentBounds = active.getBoundingClientRect();
    const railBounds = rail.getBoundingClientRect();
    rail.scrollLeft += currentBounds.left - railBounds.left - (railBounds.width - currentBounds.width) / 2;
  }, [activeIndex]);

  return (
    <div className="rev-page rev-main-guide">
      <section className="rev-run" aria-labelledby="rev-quest-title">
        <header className="rev-run-header">
          <span className="rev-run-header__kicker">MAIN EASTER EGG / REVELATIONS</span>
          <h2 id="rev-quest-title">For The Good Of All</h2>
          <p>Twelve steps across every old map. Screenshots show where to aim.</p>
        </header>

        <div className="rev-main-grid">
          <nav className="rev-step-list" aria-label="Revelations Easter Egg steps" ref={railRef}>
            <ol>
              {revGuideSteps.map((step, index) => (
                <li key={step.id}>
                  <button
                    type="button"
                    className="rev-step-button"
                    aria-current={index === activeIndex ? 'step' : undefined}
                    aria-controls={step.id}
                    onClick={() => selectStep(step.id)}
                  >
                    <span className="rev-step-button__num">{padded(index + 1)}</span>
                    <span className="rev-step-button__title">{step.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rev-step-panel">
            <div className="rev-step-meta" aria-live="polite">
              <span>STEP {padded(activeIndex + 1)}</span>
              <span>{padded(activeIndex + 1)} / {revGuideSteps.length}</span>
            </div>
            <div className="rev-guide">
              <GuideSteps
                label="For The Good Of All"
                steps={revGuideSteps}
                presentation="runbook"
                activeStepId={selected.id}
                footer={<CompleteEasterEgg mapId="revelations" />}
              />
            </div>
            <nav className="rev-step-controls" aria-label="Previous and next guide steps">
              <button type="button" disabled={!previous} onClick={() => previous && selectStep(previous.id)}>
                <small>Previous</small>
                <strong>{previous?.title ?? 'Start of the run'}</strong>
              </button>
              <button type="button" disabled={!next} onClick={() => next && selectStep(next.id)}>
                <small>Next</small>
                <strong>{next?.title ?? 'Last objective reached'}</strong>
              </button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
