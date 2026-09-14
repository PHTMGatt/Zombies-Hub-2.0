import React from 'react';
import { Link } from 'react-router-dom';
import originsSpeedRun, { originsSpeedRunVideo } from '../data/sideEE/OriginsSpeedRun';
import {
  originsLightningSwitchRoute,
  originsLightningSwitchVerification,
} from '../../../../shared/data/originsLightning';
import '../styles/SideEE/OriginsSpeedRun.css';
import '../styles/SideEE/OriginsSpeedRunHildaless.css';

const formatTimestamp = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
};

export default function OriginsSpeedRunGuide({ cover }) {
  return (
    <article className="origins-speedrun-guide">
      <header
        className="origins-speedrun-hero"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 13, 23, .95), rgba(5, 20, 34, .7), rgba(3, 10, 18, .88)), url(${cover})` }}
      >
        <div>
          <span className="origins-speedrun-kicker">Black Ops III · Advanced Route</span>
          <h1>Origins Speed Run</h1>
          <p>{originsSpeedRun.intro}</p>
        </div>

        <div className="origins-speedrun-actions">
          <a href={originsSpeedRunVideo.url} target="_blank" rel="noreferrer">
            Watch Full Route ↗
          </a>
          <Link to="/maps/origins">Normal Origins Guide</Link>
        </div>
      </header>

      <section className="origins-speedrun-strip" aria-label="Speedrun loadout">
        {originsSpeedRun.loadout.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </section>

      <section className="origins-speedrun-rules">
        {originsSpeedRun.quickRules.map((rule) => (
          <div key={rule.label}>
            <strong>{rule.label}</strong>
            <span>{rule.text}</span>
          </div>
        ))}
      </section>

      <section className="origins-speedrun-lightning" id="lightning-reference">
        <div className="origins-speedrun-section-heading">
          <span>Verified Quick Reference</span>
          <h2>Lightning Staff Switches</h2>
          <p>
            Final BO3 Zombies Chronicles positions. <strong>Arrow = the direction the protruding switch handle points</strong>,
            not the opposite face of the switch.
          </p>
        </div>

        <div className="origins-speedrun-switch-status">
          <span>⚡ VERIFIED BO3</span>
          <strong>Spawn ← · Gen 2 ↓ · Gen 5 ↓ · Gen 4 ↑ · Church ↓ → · Church ↑ ↑ · Excavation ↑</strong>
        </div>

        <div className="origins-speedrun-switch-grid" aria-label="Verified Lightning Staff dial positions">
          {originsLightningSwitchRoute.map((item) => (
            <article className="origins-speedrun-switch" key={item.id}>
              <div className="origins-speedrun-switch-arrow" aria-hidden="true">{item.arrow}</div>
              <div className="origins-speedrun-switch-copy">
                <strong>{item.shortLabel}</strong>
                <span>{item.direction} · {item.clock}</span>
                <small>{item.location}</small>
              </div>
            </article>
          ))}
        </div>

        <div className="origins-speedrun-switch-rule">
          <strong>Speedrun rule:</strong>
          <span>{originsLightningSwitchVerification.note}</span>
          <Link to="/maps/origins/lightning-staff">Open normal Lightning Staff guide →</Link>
        </div>

        <details className="origins-speedrun-switch-route">
          <summary>Open route notes for all 7 switches</summary>
          <ol>
            {originsLightningSwitchRoute.map((item) => (
              <li key={item.id}>
                <strong>{item.shortLabel} {item.arrow}</strong>
                <span>{item.speedrunNote}</span>
              </li>
            ))}
          </ol>
        </details>

        <details className="origins-speedrun-hildaless">
          <summary>
            <span>Advanced alternate</span>
            <strong>{originsSpeedRun.hildalessLightning.title}</strong>
            <small>{originsSpeedRun.hildalessLightning.summary}</small>
          </summary>
          <ol>
            {originsSpeedRun.hildalessLightning.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <a
            href={originsSpeedRun.hildalessLightning.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="origins-speedrun-hildaless-video"
          >
            Watch hildaless demo ↗
          </a>
          <p>{originsSpeedRun.hildalessLightning.warning}</p>
        </details>
      </section>

      <section className="origins-speedrun-route">
        <div className="origins-speedrun-section-heading">
          <span>Run Route</span>
          <h2>Eight checkpoints</h2>
          <p>Read the bold line while playing. Open the detail only when you need the setup or exploit timing.</p>
        </div>

        <nav className="origins-speedrun-jumps" aria-label="Origins speedrun checkpoints">
          {originsSpeedRun.route.map((phase, index) => (
            <a key={phase.id} href={`#speedrun-${phase.id}`}>{index + 1}. {phase.title}</a>
          ))}
        </nav>

        <div className="origins-speedrun-phases">
          {originsSpeedRun.route.map((phase, index) => (
            <details
              key={phase.id}
              id={`speedrun-${phase.id}`}
              className="origins-speedrun-phase"
              open={phase.id === 'lightning'}
            >
              <summary>
                <span className="origins-speedrun-phase-number">{index + 1}</span>
                <span className="origins-speedrun-phase-copy">
                  <strong>{phase.title}</strong>
                  <small>{phase.summary}</small>
                </span>
                {Number.isFinite(phase.timestamp) && (
                  <a
                    href={originsSpeedRunVideo.timestampUrl(phase.timestamp)}
                    target="_blank"
                    rel="noreferrer"
                    className="origins-speedrun-time"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {formatTimestamp(phase.timestamp)} ↗
                  </a>
                )}
              </summary>

              <ol>
                {phase.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ol>
            </details>
          ))}
        </div>
      </section>

      <div className="origins-speedrun-footer-actions">
        <Link to="/side-easter-eggs">← Side Easter Eggs</Link>
        <a href={originsSpeedRunVideo.url} target="_blank" rel="noreferrer">Full speedrun video ↗</a>
      </div>
    </article>
  );
}
