import React from 'react';
import { GuideRun } from '../../../../shared/ui/GuideRun';
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
].map((phase) => ({ ...phase, notesLabel: 'Quick notes' }));

const theme = {
  accent: '#c79cf2',
  'accent-2': '#9a65ce',
  'on-accent': '#160d1e',
  text: '#f7f1fc',
  muted: '#d6cbdd',
  panel: 'rgba(12, 9, 19, 0.88)',
  line: 'rgba(190, 152, 223, 0.2)',
};

function MainGuide() {
  return (
    <main className="soe-page">
      <div className="soe-page__background" aria-hidden="true" />
      <GuideRun
        runId="shadows-of-evil"
        title="Shadows of Evil"
        intro="Five phases from the rituals to the train finale. Expand notes only when you need the exact mechanic."
        alert={{
          label: 'Player requirement',
          text: 'Solo can defeat the Shadowman; the final train/Keeper sequence and full ending require four players.',
        }}
        phases={phases}
        theme={theme}
      >
        <details className="soe-map-reference">
          <summary>Open Morg City map reference</summary>
          <img src={soeLayout} alt="Shadows of Evil map layout" loading="lazy" />
        </details>
      </GuideRun>
    </main>
  );
}

export default MainGuide;
