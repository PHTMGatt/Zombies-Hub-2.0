import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import originsSpeedRun, { originsSpeedRunVideo } from '../../../../../shared/data/originsSpeedRun';

const route = originsSpeedRun.route;

const formatTimestamp = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function SpeedRunRoute() {
  const [index, setIndex] = useState(0);
  const railRef = useRef(null);
  const panelRef = useRef(null);
  const firstRender = useRef(true);

  const phase = route[index];
  const previous = route[index - 1];
  const next = route[index + 1];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Phones: checkpoints are a swipeable row; keep the current one centered (row only, never the page).
    const rail = railRef.current;
    const active = rail?.querySelector('.speedrun-checkpoint.active');
    if (rail && active && rail.scrollWidth > rail.clientWidth) {
      const railBox = rail.getBoundingClientRect();
      const activeBox = active.getBoundingClientRect();
      rail.scrollLeft += activeBox.left - railBox.left - (railBox.width - activeBox.width) / 2;
    }

    // After Previous/Next from the bottom of a long checkpoint, bring its start back into view.
    const panel = panelRef.current;
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hub-nav-height')) || 0;
    if (panel && panel.getBoundingClientRect().top < navHeight) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [index]);

  return (
    <div className="speedrun-route">
      <p className="speedrun-hint">
        First run? Read <Link to="prep">Prep &amp; Rules</Link> before you load in.
      </p>

      <div className="speedrun-route__grid">
        <nav className="speedrun-rail" aria-label="Origins speed run checkpoints">
          <ol ref={railRef}>
            {route.map((item, itemIndex) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`speedrun-checkpoint${itemIndex === index ? ' active' : ''}${itemIndex < index ? ' past' : ''}`}
                  aria-current={itemIndex === index ? 'step' : undefined}
                  onClick={() => setIndex(itemIndex)}
                >
                  <span className="speedrun-checkpoint__num">{itemIndex + 1}</span>
                  <span className="speedrun-checkpoint__copy">
                    <strong>{item.title}</strong>
                    {Number.isFinite(item.timestamp) && <small>{formatTimestamp(item.timestamp)}</small>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="speedrun-panel" ref={panelRef} id={`speedrun-${phase.id}`}>
          <div className="speedrun-panel__meta">
            <span>Checkpoint {index + 1} of {route.length}</span>
            {Number.isFinite(phase.timestamp) && (
              <a href={originsSpeedRunVideo.timestampUrl(phase.timestamp)} target="_blank" rel="noreferrer">
                Watch at {formatTimestamp(phase.timestamp)} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          <h3>{phase.title}</h3>
          <p className="speedrun-panel__summary">{phase.summary}</p>

          <ol className="speedrun-panel__steps">
            {phase.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ol>

          {phase.id === 'lightning' && (
            <Link className="speedrun-callout" to="lightning">
              <strong>Lightning Switches →</strong>
              <span>Interactive dials for all seven switches, plus the hildaless first-piece route.</span>
            </Link>
          )}

          <div className="speedrun-panel__nav">
            <button type="button" aria-label="Previous checkpoint" disabled={!previous} onClick={() => setIndex(index - 1)}>
              <small>← Previous</small>
              <span>{previous ? previous.title : 'Start of the run'}</span>
            </button>
            <button type="button" aria-label="Next checkpoint" disabled={!next} onClick={() => setIndex(index + 1)}>
              <small>Next →</small>
              <span>{next ? next.title : 'End of the route'}</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
