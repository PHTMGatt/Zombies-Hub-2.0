import React, { useState } from 'react';
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

export default function MainGuide() {
  const [openStep, setOpenStep] = useState(0);

  return (
    <main className="soe-page">
      <div className="soe-page__background" aria-hidden="true" />
      <div className="soe-page__content">
        <GuideHero
          kicker="Shadows of Evil"
          title="Main Easter Egg Guide"
          description="The full Morg City quest in actual run order: rituals, sword, Pack-a-Punch, sword upgrade, flags, Shadowman, and the four-player train finale."
        >
          <GuideChip>Black Ops III</GuideChip>
          <GuideChip>Solo through Shadowman</GuideChip>
          <GuideChip>4 players for full ending</GuideChip>
          <GuideChip>Transcript verified</GuideChip>
        </GuideHero>

        <GuideCallout label="Player requirement" tone="info" className="soe-player-note">
          You can play the quest solo through the Shadowman boss fight. The final train / Keeper sequence, ending cutscene, and Summoning Key achievement require a four-player game.
        </GuideCallout>

        <GuideSection
          kicker="Run Order"
          title="What do I do next?"
          description="Tap a step to expand the quick notes. The first line stays short enough to scan while you are actually playing."
        >
          <GuideStepList>
            {soeGuide.map((step, index) => {
              const isOpen = openStep === index;
              return (
                <button
                  type="button"
                  key={step.title}
                  className={`soe-step ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenStep(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <GuideStepCard
                    step={index + 1}
                    label="Main Quest"
                    title={step.title}
                    summary={step.summary}
                  >
                    {isOpen && (
                      <ul className="soe-step__notes">
                        {step.notes.map((note) => <li key={note}>{note}</li>)}
                      </ul>
                    )}
                  </GuideStepCard>
                </button>
              );
            })}
          </GuideStepList>
        </GuideSection>

        <GuideSection
          kicker="Map Reference"
          title="Morg City Layout"
          description="Keep the map visible when the guide calls out a district, ritual room, tram station, or rift entrance."
          className="soe-layout-section"
        >
          <button
            type="button"
            className="soe-layout-card"
            onClick={(event) => event.currentTarget.classList.toggle('is-zoomed')}
            title="Click to enlarge map"
          >
            <img src={soeLayout} alt="Shadows of Evil map layout" />
            <span>Click to enlarge / collapse</span>
          </button>
        </GuideSection>
      </div>
    </main>
  );
}

export default MainGuide;
