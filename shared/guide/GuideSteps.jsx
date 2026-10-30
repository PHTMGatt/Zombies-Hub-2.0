import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GuideReferences from './GuideReferences';
import { useGuideDepth, useGuideProgress } from './useGuideProgress';
import './guide.css';

/*
 * One Easter Egg, two depths.
 *   Quick: what + the visual reference + sub-tasks + critical warnings. Glance, confirm, keep playing.
 *   Full:  adds how-to steps, troubleshooting and a contextual video link.
 * Both modes render the same steps and share one progress record, so switching never loses your place.
 *
 * Step shape:
 *   { id, title, goal, refs: [reference blocks], tasks: [{ id, label }],
 *     how: [string], problems: [string], critical: [string], video: { url, label }, links: [{ to, label }] }
 */
const pad = (value) => String(value).padStart(2, '0');

// Default depths. A map can pass its own (Origins uses Low / Medium / High).
export const QUICK_FULL = [
  { id: 'quick', label: 'Quick', show: { goal: true, critical: true } },
  { id: 'full', label: 'Walkthrough', show: { goal: true, critical: true, detail: true } },
];
const DEPTH_IDS = QUICK_FULL.map((item) => item.id);

/*
 * Props: guideId, label, steps; optional depths + depth/onDepthPress (controlled), progress (from
 * useGuideProgress, when the page needs it too), selectorExtra (more buttons in the depth switch), and
 * override (replaces the steps body, e.g. a locked panel).
 */
export default function GuideSteps({ guideId, label, steps, depths, depth: controlledDepth, onDepthPress, progress: sharedProgress, selectorExtra, override }) {
  const [ownDepth, setOwnDepth] = useGuideDepth(DEPTH_IDS);
  const ownProgress = useGuideProgress(sharedProgress ? null : guideId, steps);
  const progress = sharedProgress ?? ownProgress;
  const depthList = depths ?? QUICK_FULL;
  const depthId = controlledDepth ?? ownDepth;
  const pressDepth = onDepthPress ?? setOwnDepth;
  const show = depthList.find((item) => item.id === depthId)?.show ?? QUICK_FULL[0].show;
  const mode = depthId;
  const [variant, setVariant] = useState(null);
  const railRef = useRef(null);
  const stepRef = useRef(null);
  const firstRender = useRef(true);

  const index = Math.max(0, steps.findIndex((step) => step.id === progress.current));
  const step = steps[index];
  const previous = steps[index - 1];
  const next = steps[index + 1];
  const full = Boolean(show.detail);
  const stepDone = progress.isDone(step.id);
  const taskCount = step.tasks?.length ?? 0;
  const tasksDone = step.tasks?.filter((task) => progress.isTaskDone(step.id, task.id)).length ?? 0;

  useEffect(() => {
    // Keep the current step's rail item in view (rail only) — on first load too, so a returning
    // player sees where they left off.
    const rail = railRef.current;
    const active = rail?.querySelector('.guide-rail__step.is-current');
    if (rail && active && rail.scrollWidth > rail.clientWidth) {
      const railBox = rail.getBoundingClientRect();
      const activeBox = active.getBoundingClientRect();
      rail.scrollLeft += activeBox.left - railBox.left - (railBox.width - activeBox.width) / 2;
    }

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Bring the new step on screen when its top is hidden above, or sits so low that only its title shows
    // (phones, where the step row and toolbar come first).
    const top = stepRef.current?.getBoundingClientRect().top ?? 0;
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hub-nav-height')) || 0;
    if (top < offset || top > window.innerHeight * 0.6) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stepRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [step.id]);

  const confirmReset = () => {
    if (window.confirm(`Clear your ${label} progress?`)) progress.reset();
  };

  return (
    <section className={`guide guide--${mode}${full ? ' guide--detail' : ''}`} aria-label={`${label} guide`}>
      <div className="guide-bar">
        <div className="guide-mode" role="group" aria-label="Guide depth">
          {depthList.map((item) => (
            <button key={item.id} type="button" aria-pressed={item.id === depthId} onClick={() => pressDepth(item.id)}>
              {item.label} {item.sub && <small>{item.sub}</small>}
            </button>
          ))}
          {selectorExtra}
        </div>

        <div className="guide-progress" role="status" aria-label={`${progress.completed} of ${progress.total} steps done`}>
          <span className="guide-progress__count">
            <strong>{progress.completed}</strong> / {progress.total}
          </span>
          <span className="guide-progress__meter" aria-hidden="true">
            <span style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
          </span>
        </div>

      </div>

      {override ?? (
      <div className="guide-body">
        <nav className="guide-rail" aria-label={`${label} steps`}>
          <span className="guide-rail__hint" aria-hidden="true">Swipe · {steps.length} steps →</span>
          <ol ref={railRef}>
            {steps.map((item, itemIndex) => {
              const done = progress.isDone(item.id);
              const current = item.id === step.id;
              const count = item.tasks?.length ?? 0;
              const ticked = item.tasks?.filter((task) => progress.isTaskDone(item.id, task.id)).length ?? 0;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`guide-rail__step${current ? ' is-current' : ''}${done ? ' is-done' : ''}`}
                    aria-current={current ? 'step' : undefined}
                    onClick={() => progress.goTo(item.id)}
                  >
                    <span className="guide-rail__num" aria-hidden="true">{done ? '✓' : pad(itemIndex + 1)}</span>
                    <span className="guide-rail__title">
                      {item.title}
                      <span className="visually-hidden">{done ? ' (done)' : ''}</span>
                    </span>
                    {count > 0 && !done && ticked > 0 && <span className="guide-rail__tasks">{ticked}/{count}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <article className="guide-step" ref={stepRef} aria-labelledby={`guide-step-${step.id}`}>
          <header className="guide-step__head">
            <div className="guide-step__meta">
              <span>Step {pad(index + 1)} of {steps.length}</span>
              {stepDone && <span className="guide-step__done">✓ Done</span>}
            </div>
            <h3 id={`guide-step-${step.id}`}>{step.title}</h3>
            {show.goal && step.goal && <p className="guide-step__goal">{step.goal}</p>}
          </header>

          <div className="guide-step__grid">
            <div className="guide-step__reference">
              {show.critical && step.critical?.map((text) => <p key={text} className="gref gref--warning" role="note"><strong>Watch out</strong> {text}</p>)}

              <GuideReferences refs={step.refs} tabState={{ value: variant, set: setVariant }} />

              {taskCount > 0 && (
                <div className="guide-tasks">
                  <span className="gref__label">Track it <small>{tasksDone}/{taskCount}</small></span>
                  <ul>
                    {step.tasks.map((task) => {
                      const ticked = progress.isTaskDone(step.id, task.id);
                      return (
                        <li key={task.id}>
                          <button
                            type="button"
                            className={`guide-task${ticked ? ' is-done' : ''}`}
                            aria-pressed={ticked}
                            onClick={() => progress.toggleTask(step.id, task.id)}
                            style={task.tone ? { '--gref-tone': task.tone } : undefined}
                          >
                            <span className="guide-task__box" aria-hidden="true">{ticked ? '✓' : ''}</span>
                            {task.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {full && (step.how?.length > 0 || step.problems?.length > 0 || step.video) && (
              <div className="guide-step__detail">
                {step.how?.length > 0 && (
                  <section className="guide-how">
                    <h4>How to do it</h4>
                    <ol>{step.how.map((line) => <li key={line}>{line}</li>)}</ol>
                  </section>
                )}
                {step.problems?.length > 0 && (
                  <section className="guide-problems">
                    <h4>Not working?</h4>
                    <ul>{step.problems.map((line) => <li key={line}>{line}</li>)}</ul>
                  </section>
                )}
                {step.video && (
                  <a className="guide-video" href={step.video.url} target="_blank" rel="noreferrer">
                    Need to see it happen? {step.video.label ?? 'Watch this section'} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {step.links?.length > 0 && (
            <div className="guide-links">
              {step.links.map((link) => (
                <Link key={link.to} to={link.to} style={link.tone ? { '--gref-tone': link.tone } : undefined}>
                  {link.label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          )}

          <div className="guide-actions">
            <button
              type="button"
              className="guide-actions__nav"
              aria-label="Previous step"
              disabled={!previous}
              onClick={() => progress.goTo(previous.id)}
            >
              ←
            </button>
            <button
              type="button"
              className={`guide-actions__done${stepDone ? ' is-done' : ''}`}
              aria-pressed={stepDone}
              onClick={() => progress.toggleStep(step.id)}
            >
              {stepDone ? '✓ Done — undo' : 'Mark step done'}
            </button>
            <button
              type="button"
              className="guide-actions__nav"
              aria-label="Next step"
              disabled={!next}
              onClick={() => progress.goTo(next.id)}
            >
              →
            </button>
          </div>
        </article>
      </div>
      )}

      <div className="guide-footer">
        <button type="button" className="guide-reset" onClick={confirmReset} disabled={progress.completed === 0 && !steps.some((s) => s.tasks?.some((t) => progress.isTaskDone(s.id, t.id)))}>
          Reset progress
        </button>
      </div>
    </section>
  );
}
