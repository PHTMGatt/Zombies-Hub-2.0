import React from 'react';
import { Link } from 'react-router-dom';
import originsSpeedRun, { originsSpeedRunVideo } from '../data/sideEE/OriginsSpeedRun';
import lightningSwitches from '../assets/images/SideEE/origins-lightning-switches.webp';
import lightningSwitchReference from '../assets/images/SideEE/origins-lightning-switch-reference.webp';
import '../styles/SideEE/OriginsSpeedRun.css';

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
          <span>Quick Reference</span>
          <h2>Lightning Staff Switches</h2>
          <p>Use the red arrows in the reference as the target switch positions. The close-up image is there purely as a fast shape/orientation check mid-run.</p>
        </div>

        <div className="origins-speedrun-lightning-grid">
          <a href={lightningSwitches} target="_blank" rel="noreferrer" className="origins-speedrun-reference origins-speedrun-reference--map">
            <img src={lightningSwitches} alt="Origins Lightning Staff switch locations and target directions" loading="lazy" />
            <span>Open full Lightning switch map ↗</span>
          </a>
          <a href={lightningSwitchReference} target="_blank" rel="noreferrer" className="origins-speedrun-reference origins-speedrun-reference--switch">
            <img src={lightningSwitchReference} alt="Close-up reference for the Origins Lightning Staff switch shape" loading="lazy" />
            <span>Open switch-shape reference ↗</span>
          </a>
        </div>
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
                <a
                  href={originsSpeedRunVideo.timestampUrl(phase.timestamp)}
                  target="_blank"
                  rel="noreferrer"
                  className="origins-speedrun-time"
                  onClick={(event) => event.stopPropagation()}
                >
                  {formatTimestamp(phase.timestamp)} ↗
                </a>
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
