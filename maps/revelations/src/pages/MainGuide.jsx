import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepItem } from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import RevIslandMap from '../components/RevIslandMap';
import revGuideSteps from '../data/revGuideSteps';
import { STEP_ISLANDS } from '../data/revIslands';
import '../styles/MainGuide.css';

/*
 * For The Good Of All is a scavenger hunt across every old map, so the guide is one step at a time:
 * pick a step (numbered chips on phones, the step list on wide screens), see only that step, and, when
 * the step sends you around the islands, which ones light up. The selected step lives in the URL hash
 * (#servant), so search results and shared links open on it. The islands each step lights are in
 * data/revIslands.js.
 */

const ids = revGuideSteps.map((step) => step.id);
const fragment = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};

const MainGuide = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const pickerRef = useRef(null);
  const cardRef = useRef(null);
  const walked = useRef(false);
  const fromHash = fragment(hash);
  const selectedId = ids.includes(fromHash) ? fromHash : ids[0];
  const index = ids.indexOf(selectedId);
  const step = revGuideSteps[index];
  const prev = revGuideSteps[index - 1];
  const next = revGuideSteps[index + 1];
  const islands = STEP_ISLANDS[step.id];

  // A deep link lands on the picker once, so the step and its chips are both in view.
  useEffect(() => {
    if (ids.includes(fragment(window.location.hash))) pickerRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, []);

  // Back / Next open the new step at its title with focus on the card: the reader starts the step at the
  // top, a screen reader hears which step it is, and focus never drops to the page when the button it was
  // on goes away at step 1 or 12. Chip and arrow-key picks leave focus and scroll on the picker.
  useEffect(() => {
    if (!walked.current) return;
    walked.current = false;
    const card = cardRef.current;
    if (!card) return;
    card.focus({ preventScroll: true });
    const clear = parseFloat(getComputedStyle(card).scrollMarginTop) || 0;
    if (card.getBoundingClientRect().top < clear) card.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [selectedId]);

  const select = (id) => navigate({ hash: `#${id}` }, { replace: true, preventScrollReset: true });
  const walk = (id) => {
    walked.current = true;
    select(id);
  };
  const onKey = (event) => {
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const target = ids[(index + move + ids.length) % ids.length];
    select(target);
    document.getElementById(`rev-tab-${target}`)?.focus();
  };

  return (
    <div className="rev-page rev-main-guide">
      <div className="rev-run">
        <header className="rev-run-header">
          <h2>For The Good Of All</h2>
          <p>Twelve steps across every old map. Screenshots show where to aim.</p>
        </header>

        <div className="rev-picker" ref={pickerRef}>
          <div className="rev-chips" role="tablist" aria-label="For The Good Of All steps" aria-orientation="vertical" onKeyDown={onKey} data-step-tabs>
            {revGuideSteps.map((item, i) => {
              const on = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  id={`rev-tab-${item.id}`}
                  type="button"
                  role="tab"
                  className="rev-chip"
                  aria-selected={on}
                  aria-controls="rev-step-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(item.id)}
                >
                  <span className="rev-chip__n">{i + 1}</span>
                  <span className="rev-chip__title">{item.title}</span>
                </button>
              );
            })}
          </div>

          <section className="guide rev-card" role="tabpanel" id="rev-step-panel" aria-labelledby={`rev-tab-${step.id}`} tabIndex={-1} ref={cardRef}>
            <div className="rev-card__mark" aria-hidden="true">{index + 1}</div>
            <ol className="guide-seq rev-card__step" start={index + 1}>
              <StepItem key={step.id} step={step} />
            </ol>
            {islands && (
              <RevIslandMap className="rev-card__isles" title={islands.note} lit={islands.lit} />
            )}
            <nav className="rev-card__walk" aria-label="Previous and next step">
              {prev ? (
                <button type="button" className="rev-card__back" onClick={() => walk(prev.id)}>
                  <small>Back</small>
                  <span>{index}. {prev.title}</span>
                </button>
              ) : <span />}
              {next ? (
                <button type="button" className="rev-card__next" onClick={() => walk(next.id)}>
                  <small>Next</small>
                  <span>{index + 2}. {next.title}</span>
                </button>
              ) : <span />}
            </nav>
          </section>
        </div>

        <div className="guide-seq__footer rev-run__done"><CompleteEasterEgg mapId="revelations" /></div>
      </div>
    </div>
  );
};

export default MainGuide;
