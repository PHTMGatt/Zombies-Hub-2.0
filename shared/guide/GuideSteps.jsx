import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GuideReferences from './GuideReferences';
import { MAPS, mainAchievementFor, resetMap, unlockAchievement } from '../achievements/achievements';
import QuickRefs from './QuickRefs';
import { useGuideDepth, useGuideProgress } from './useGuideProgress';
import './guide.css';

/*
 * One Easter Egg, two depths.
 *   Quick: "do this now" + the visual reference + sub-tasks + critical warnings. Glance, confirm, keep playing.
 *   Walkthrough: adds the how-to steps and a contextual video link.
 * "Not working?" troubleshooting is available at both depths but stays collapsed until asked for.
 * Both modes render the same steps and share one progress record, so switching never loses your place.
 *
 * Step shape:
 *   { id, title, goal, refs: [reference blocks], tasks: [{ id, label, hint?, tone? }],
 *     how: [string], problems: [string], critical: [string], video: { url, label }, links: [{ to, label }] }
 *   A tabs ref's tabs may add their own `problems` and `links`, shown only while that tab is selected.
 */
const pad = (value) => String(value).padStart(2, '0');

// Default depths. A map can pass its own (Origins uses Low / Medium / High).
export const QUICK_FULL = [
  { id: 'quick', label: 'Quick', show: { goal: true, critical: true } },
  { id: 'full', label: 'Walkthrough', show: { goal: true, critical: true, detail: true } },
];
const DEPTH_IDS = QUICK_FULL.map((item) => item.id);

/*
 * Props: guideId, label, steps; optional mapId (enables the map's main Easter Egg achievement and the
 * "reset map" option), quickRefs ([{ label, stepId } | { label, to }] — the map's most-used references,
 * opened in a sheet without moving the run), depths + depth/onDepthPress (controlled), progress (from useGuideProgress, when
 * the page needs it too), selectorExtra (more buttons in the depth switch), and override (replaces the
 * steps body, e.g. a locked panel).
 */
export default function GuideSteps({ guideId, label, steps, mapId, quickRefs, depths, depth: controlledDepth, onDepthPress, progress: sharedProgress, selectorExtra, override }) {
  const [ownDepth, setOwnDepth] = useGuideDepth(DEPTH_IDS);
  const ownProgress = useGuideProgress(sharedProgress ? null : guideId, steps);
  const progress = sharedProgress ?? ownProgress;
  const depthList = depths ?? QUICK_FULL;
  const depthId = controlledDepth ?? ownDepth;
  const pressDepth = onDepthPress ?? setOwnDepth;
  const show = depthList.find((item) => item.id === depthId)?.show ?? QUICK_FULL[0].show;
  const mode = depthId;
  const [variant, setVariant] = useState(null);
  // ?ref=<stepId> (from search) opens that step's references in the Quick refs sheet.
  const [searchParams, setSearchParams] = useSearchParams();
  const refParam = searchParams.get('ref');
  const clearRef = () => {
    if (!searchParams.has('ref')) return;
    const next = new URLSearchParams(searchParams);
    next.delete('ref');
    setSearchParams(next, { replace: true });
  };
  const railRef = useRef(null);
  const stepRef = useRef(null);
  const stepHeadingRef = useRef(null);
  const firstRender = useRef(true);

  const index = Math.max(0, steps.findIndex((step) => step.id === progress.current));
  const step = steps[index];
  const previous = steps[index - 1];
  const next = steps[index + 1];
  const full = Boolean(show.detail);
  const stepDone = progress.isDone(step.id);
  // A tabbed reference (e.g. one tab per bow) can carry its own troubleshooting and page link; they follow
  // the selected tab so the step never mixes tips for variants the player isn't doing.
  const tabsRef = step.refs?.find((ref) => ref.type === 'tabs');
  const activeTab = tabsRef ? (tabsRef.tabs.find((tab) => tab.id === variant) ?? tabsRef.tabs[0]) : null;
  const problems = [...(step.problems ?? []), ...(activeTab?.problems ?? [])];
  const links = [...(activeTab?.links ?? []), ...(step.links ?? [])];
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

    // Bring the step on screen when its top is hidden above, or sits so low that only its title shows
    // (phones, where the step row and toolbar come first). On first load this only happens for a run
    // already under way, so a returning player lands on their step, not on the page intro.
    const first = firstRender.current;
    firstRender.current = false;
    const resuming = first && (index > 0 || progress.completed > 0);
    // No step on screen (an override such as a locked panel), or a fresh run: nothing to scroll to.
    if (!stepRef.current || (first && !resuming)) return;
    // A step change the player made moves focus to the new heading, so screen readers announce it.
    if (!first) stepHeadingRef.current?.focus({ preventScroll: true });
    const top = stepRef.current.getBoundingClientRect().top;
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hub-nav-height')) || 0;
    if (top < offset || top > window.innerHeight * (resuming ? 0.4 : 0.6)) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stepRef.current.scrollIntoView({ behavior: reduceMotion || resuming ? 'auto' : 'smooth', block: 'start' });
    }
  }, [step.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Every step done is the Easter Egg done: unlock it once, on the player's own tap. The ref starts at
  // the stored value, so loading an already-finished run never re-announces it.
  const allDone = progress.completed === progress.total;
  const wasAllDone = useRef(allDone);
  useEffect(() => {
    if (allDone && !wasAllDone.current) {
      const achievement = mapId && mainAchievementFor(mapId);
      if (achievement) unlockAchievement(achievement.id);
    }
    wasAllDone.current = allDone;
  }, [allDone, mapId]);

  const map = mapId ? MAPS[mapId] : null;
  const mainAchievement = mapId ? mainAchievementFor(mapId) : null;
  const showFinish = allDone && index === steps.length - 1;
  const hasProgress = progress.completed > 0 || steps.some((s) => s.tasks?.some((t) => progress.isTaskDone(s.id, t.id)));
  const confirmReset = (message) => {
    if (window.confirm(message)) progress.reset();
  };
  const confirmNewRun = () => confirmReset(`Start a new ${label} run? Your current ticks are cleared. Achievements stay.`);
  const confirmResetRun = () => confirmReset(`Start ${label} over? This clears your current step, finished steps and ticks. Achievements stay.`);
  const confirmResetMap = () => {
    if (window.confirm(`Clear everything saved for ${map.name}? Guide progress and saved notes are removed. Achievements stay.`)) {
      resetMap(mapId);
      progress.reset();
    }
  };

  return (
    <section className={`guide guide--${mode}${full ? ' guide--detail' : ''}`} aria-label={`${label} guide`}>
      <div className="guide-bar">
        {/* A depth switch only when the depths differ: a checklist with no Walkthrough detail hides it. */}
        {(depths || steps.some((entry) => entry.how?.length || entry.video)) && (
        <div className="guide-mode" role="group" aria-label="Guide depth">
          {depthList.map((item) => (
            <button key={item.id} type="button" aria-pressed={item.id === depthId} onClick={() => pressDepth(item.id)}>
              {item.label} {item.sub && <small>{item.sub}</small>}
            </button>
          ))}
          {selectorExtra}
        </div>
        )}

        {(quickRefs?.length > 0 || refParam) && (
          <QuickRefs items={quickRefs ?? []} steps={steps} label={label} openStepId={refParam} onDismiss={clearRef} />
        )}

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
            <h3 ref={stepHeadingRef} id={`guide-step-${step.id}`} tabIndex="-1">{step.title}</h3>
            {show.goal && step.goal && (
              <p className="guide-step__goal"><span className="guide-step__now">Do this now</span> {step.goal}</p>
            )}
          </header>

          <div className="guide-step__grid">
            <div className="guide-step__reference">
              {show.critical && step.critical?.map((text) => <p key={text} className="gref gref--warning" role="note"><strong>Watch out</strong> {text}</p>)}

              <GuideReferences refs={step.refs} tabState={{ value: variant, set: setVariant }} />

              {taskCount > 0 && (
                <div className={`guide-tasks${step.tasks.some((task) => task.hint) ? ' guide-tasks--hints' : ''}`}>
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
                            <span className="guide-task__text">
                              {task.label}
                              {task.hint && <small>{task.hint}</small>}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {full && (step.how?.length > 0 || step.video) && (
              <div className="guide-step__detail">
                {step.how?.length > 0 && (
                  <section className="guide-how">
                    <h4>How to do it</h4>
                    <ol>{step.how.map((line) => <li key={line}>{line}</li>)}</ol>
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

          {problems.length > 0 && (
            <details className="guide-problems" key={`problems-${step.id}`}>
              <summary>Not working?</summary>
              <ul>{problems.map((line) => <li key={line}>{line}</li>)}</ul>
            </details>
          )}

          {showFinish && (
            <div className="guide-finish" role="status">
              <strong>{mainAchievement ? `${mainAchievement.title} complete` : `${label} complete`}</strong>
              <div className="guide-finish__actions">
                {mainAchievement && <Link to="/achievements">View achievement</Link>}
                <button type="button" onClick={confirmNewRun}>Start new run</button>
                <Link to="/allmaps">Back to maps</Link>
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="guide-links">
              {links.map((link) => (
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

      {/* Destructive actions live in a quiet menu below the guide, away from Mark step done. */}
      <div className="guide-footer">
        <details className="guide-menu">
          <summary>Progress options</summary>
          <div className="guide-menu__list">
            <button type="button" onClick={confirmResetRun} disabled={!hasProgress}>Reset this run</button>
            {map && <button type="button" onClick={confirmResetMap}>Reset all {map.name} progress</button>}
            <Link to="/achievements">Achievements + reset all</Link>
          </div>
        </details>
      </div>
    </section>
  );
}
