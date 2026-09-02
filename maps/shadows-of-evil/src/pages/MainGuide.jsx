import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import soeGuide from '../data/soeGuide';
import soeLayout from '../../../../apps/hub/src/assets/images/BO3/Shadows_Of_Evil.webp';
import '../styles/Shadows.css';

const phases = [
  {
    title: 'Rituals + Apothicon Sword',
    summary: 'Complete all four district rituals, record the three train symbols, unlock the sword egg, charge it at all four statues, and collect the Apothicon Sword.',
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
    title: 'Shadowman Fight',
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
      <div className="soe-page__content">
        <GuideHero
          kicker="Shadows of Evil"
          title="Main Easter Egg Guide"
          description="Five phases from rituals to the train finale. Open the notes only when you reach that part of the run."
        >
          <GuideChip>Solo through Shadowman</GuideChip>
          <GuideChip>4 players for full ending</GuideChip>
        </GuideHero>

        <GuideCallout label="Player requirement" tone="info" className="soe-player-note">
          Solo can reach and defeat the Shadowman. The final train/Keeper sequence and ending require four players.
        </GuideCallout>

        <GuideSection kicker="Main Run" title="Five phases">
          <GuideStepList className="zh-guide-step-list--roadmap">
            {phases.map((phase, index) => (
              <GuideStepCard
                key={phase.title}
                step={index + 1}
                label="Main Quest"
                title={phase.title}
                summary={phase.summary}
              >
                <details className="soe-phase-notes">
                  <summary>Quick notes</summary>
                  <ul>
                    {phase.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                </details>
              </GuideStepCard>
            ))}
          </GuideStepList>
        </GuideSection>

        <details className="soe-map-reference">
          <summary>Open Morg City map reference</summary>
          <img src={soeLayout} alt="Shadows of Evil map layout" />
        </details>
      </div>
    </main>
  );
}

export default MainGuide;
