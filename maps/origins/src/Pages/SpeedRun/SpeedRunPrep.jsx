import React from 'react';
import originsSpeedRun from '../../../../../shared/data/originsSpeedRun';

export default function SpeedRunPrep() {
  return (
    <div className="speedrun-prep">
      <section className="speedrun-card">
        <h3>Loadout</h3>
        <ul className="speedrun-checklist">
          {originsSpeedRun.loadout.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="speedrun-card">
        <h3>Timing rules</h3>
        <dl className="speedrun-rules">
          {originsSpeedRun.quickRules.map((rule) => (
            <div key={rule.label}>
              <dt>{rule.label}</dt>
              <dd>{rule.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
