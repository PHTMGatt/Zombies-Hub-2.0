import React from 'react';
import { gorodBossPhases } from '../data/gorodRun';
import '../styles/BossFight.css';

const BossFight = () => (
  <main className="gorod-boss-page">
    <header className="gorod-boss-header">
      <span>Final Battle</span>
      <h2>Dragon + Nikolai</h2>
      <p>Two phases. Bring a fresh shield, strong perks, and preferably a Pack-a-Punched Ray Gun Mark 3.</p>
    </header>

    <aside className="gorod-boss-loadout">
      <strong>Recommended:</strong>
      <span>Ray Gun Mark 3</span>
      <span>Fresh Shield</span>
      <span>In Plain Sight</span>
    </aside>

    <div className="gorod-boss-phases">
      {gorodBossPhases.map((phase, index) => (
        <section key={phase.title} className="gorod-boss-phase">
          <div className="gorod-boss-phase__title">
            <span>{index + 1}</span>
            <h3>{phase.title}</h3>
          </div>
          <p>{phase.summary}</p>
          <ul>
            {phase.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </section>
      ))}
    </div>
  </main>
);

export default BossFight;
