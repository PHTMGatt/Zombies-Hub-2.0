import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaUndoAlt } from 'react-icons/fa';
import { readProgress, writeProgress } from './runProgress';
import './GuideRun.css';

// Main Easter Egg run sheet: one phase per card, action first, details folded away.

export function useRunProgress(runId, total) {
  const [done, setDone] = useState(() => readProgress(runId, total));

  useEffect(() => {
    writeProgress(runId, done);
  }, [runId, done]);

  const toggle = useCallback((index) => {
    setDone((current) => (
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index].sort((a, b) => a - b)
    ));
  }, []);

  const reset = useCallback(() => setDone([]), []);

  let next = null;
  for (let i = 0; i < total; i += 1) {
    if (!done.includes(i)) {
      next = i;
      break;
    }
  }

  return { done, toggle, reset, next };
}

const pad = (n) => String(n).padStart(2, '0');

function scrollToPhase(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
}

export function GuideRun({
  runId,
  eyebrow = 'Main Easter Egg',
  title,
  intro,
  alert,
  phases,
  theme,
  className = '',
  children,
}) {
  const { done, toggle, reset, next } = useRunProgress(runId, phases.length);
  const phaseId = (index) => `run-${runId}-${index + 1}`;
  const doneCount = done.length;
  const complete = next === null;

  const style = theme
    ? Object.fromEntries(Object.entries(theme).map(([key, value]) => [`--run-${key}`, value]))
    : undefined;

  const confirmReset = () => {
    if (window.confirm('Clear your progress for this Easter Egg?')) reset();
  };

  return (
    <div className={`zh-run ${className}`.trim()} style={style}>
      <header className="zh-run__header">
        <span className="zh-run__eyebrow">{eyebrow}</span>
        <h2 className="zh-run__title">{title}</h2>
        {intro && <p className="zh-run__intro">{intro}</p>}
      </header>

      {alert && (
        <aside className="zh-run__alert">
          <strong>{alert.label}</strong>
          <span>{alert.text}</span>
        </aside>
      )}

      <ol className="zh-run__phases">
        {phases.map((phase, index) => {
          const isDone = done.includes(index);
          const isNext = index === next;
          const notes = phase.notes || [];

          return (
            <li
              key={phase.title}
              id={phaseId(index)}
              className={`zh-run-phase${isDone ? ' is-done' : ''}${isNext ? ' is-next' : ''}`}
            >
              <div className="zh-run-phase__head">
                <span className="zh-run-phase__num" aria-hidden="true">
                  {isDone ? <FaCheck /> : pad(index + 1)}
                </span>
                <div className="zh-run-phase__heading">
                  {isNext && <span className="zh-run-phase__flag">Up next</span>}
                  <h3>
                    <span className="zh-visually-hidden">Phase {index + 1}: </span>
                    {phase.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="zh-run-phase__toggle"
                  aria-pressed={isDone}
                  aria-label={isDone ? `Mark phase ${index + 1} not done` : `Mark phase ${index + 1} done`}
                  onClick={() => toggle(index)}
                >
                  {isDone ? <FaUndoAlt aria-hidden="true" /> : <FaCheck aria-hidden="true" />}
                  <span>{isDone ? 'Undo' : 'Done'}</span>
                </button>
              </div>

              {!isDone && (
                <div className="zh-run-phase__body">
                  <p className="zh-run-phase__summary">{phase.summary}</p>

                  {phase.to && (
                    <Link className="zh-run-phase__link" to={phase.to}>
                      {phase.link}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}

                  {notes.length > 0 && (
                    <details className="zh-run-phase__notes">
                      <summary>{phase.notesLabel || 'Details'}<span>{notes.length}</span></summary>
                      <ul>
                        {notes.map((note) => <li key={note}>{note}</li>)}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {children && <div className="zh-run__extras">{children}</div>}

      <div className="zh-run-dock" role="region" aria-label="Easter Egg progress">
        <div
          className="zh-run-dock__meter"
          role="progressbar"
          aria-label="Phases done"
          aria-valuemin={0}
          aria-valuemax={phases.length}
          aria-valuenow={doneCount}
        >
          <span style={{ width: `${(doneCount / phases.length) * 100}%` }} />
        </div>
        <div className="zh-run-dock__row">
          {complete ? (
            <div className="zh-run-dock__next">
              <small>{phases.length} / {phases.length} done</small>
              <strong>Easter Egg complete</strong>
            </div>
          ) : (
            <button type="button" className="zh-run-dock__next" onClick={() => scrollToPhase(phaseId(next))}>
              <small>Next · phase {next + 1} of {phases.length}</small>
              <strong>{phases[next].title}</strong>
            </button>
          )}
          {doneCount > 0 && (
            <button type="button" className="zh-run-dock__reset" onClick={confirmReset} aria-label="Reset progress">
              <FaUndoAlt aria-hidden="true" />
            </button>
          )}
          {!complete && (
            <button type="button" className="zh-run-dock__done" onClick={() => toggle(next)}>
              <FaCheck aria-hidden="true" />
              <span>Done</span>
            </button>
          )}
        </div>
        <p className="zh-visually-hidden" aria-live="polite">
          {complete ? 'All phases done.' : `${doneCount} of ${phases.length} phases done. Next: ${phases[next].title}.`}
        </p>
      </div>
    </div>
  );
}

export default GuideRun;
