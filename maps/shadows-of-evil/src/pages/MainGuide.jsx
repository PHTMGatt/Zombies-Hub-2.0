import React from 'react';
import soeGuide from '../data/soeGuide';
import soeLayout from '../../../../apps/hub/src/assets/images/BO3/Shadows_Of_Evil.webp';
import '../styles/Shadows.css';
import '../styles/MainGuide.css';

const phases = [
  {
    title: 'Rituals + Apothicon Sword',
    summary: 'Complete all four district rituals, record the train symbols, unlock and charge the sword egg, then collect the Apothicon Sword.',
    notes: [...soeGuide[0].notes, ...soeGuide[1].notes],
  },
  {
    title: 'Pack-a-Punch + Sword Upgrade',
    summary: 'Use the four Gateworms to open Pack-a-Punch, then complete the Arch-Ovum Margwa challenges and claim the upgraded sword.',
    notes: [...soeGuide[2].notes, ...soeGuide[3].notes],
  },
  {
    title: 'Flag Step',
    summary: soeGuide[4].summary,
    notes: soeGuide[4].notes,
  },
  {
    title: 'Defeat the Shadowman',
    summary: soeGuide[5].summary,
    notes: soeGuide[5].notes,
  },
  {
    title: 'Four-Player Train Finale',
    summary: soeGuide[6].summary,
    notes: soeGuide[6].notes,
  },
];

function MainGuide() {
  return (
    <main className="soe-page">
      <div className="soe-page__background" aria-hidden="true" />
      <div className="soe-page__content soe-run-sheet">
        <header className="soe-run-header">
          <div>
            <span>MAIN EASTER EGG</span>
            <h2>Shadows of Evil</h2>
          </div>
          <p>Five phases from the rituals to the train finale. Expand notes only when you need the exact mechanic.</p>
        </header>

        <div className="soe-run-alert">
          <strong>Player requirement:</strong>
          <span>solo can defeat the Shadowman; the final train/Keeper sequence and full ending require four players.</span>
        </div>

        <ol className="soe-run-flow">
          {phases.map((phase, index) => (
            <li key={phase.title}>
              <span className="soe-run-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="soe-run-copy">
                <h3>{phase.title}</h3>
                <p>{phase.summary}</p>
                <details className="soe-phase-notes">
                  <summary>Quick notes</summary>
                  <ul>
                    {phase.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                </details>
              </div>
            </li>
          ))}
        </ol>

        <details className="soe-map-reference">
          <summary>Open Morg City map reference</summary>
          <img src={soeLayout} alt="Shadows of Evil map layout" />
        </details>
      </div>
    </main>
  );
}

export default MainGuide;
