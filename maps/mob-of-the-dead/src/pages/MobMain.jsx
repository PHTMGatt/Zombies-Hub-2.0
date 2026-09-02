import React, { useState } from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { mobPrerequisites, mobRun } from '../data/mobGuide';
import '../styles/MobMain.css';

const MobMain = () => {
  const [openStep, setOpenStep] = useState(0);

  return (
    <main className="mobmain-page">
      <GuideHero
        kicker="Mob of the Dead"
        title="Pop Goes the Weasel"
        description="A run-first guide rebuilt from the full 2026 Easter Egg walkthrough: plane setup, bridge trips, Hell's Retriever, skulls, Afterlife codes, audio trail, and the final showdown in the order you actually perform them."
      >
        <GuideChip>Alcatraz</GuideChip>
        <GuideChip>Main Easter Egg</GuideChip>
        <GuideChip>2+ players to finish</GuideChip>
      </GuideHero>

      <GuideCallout label="Prerequisites" tone="info" className="mob-prereq-callout">
        <ul className="mob-prereq-list">
          {mobPrerequisites.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </GuideCallout>

      <GuideSection
        kicker="Run Order"
        title="What do I do next?"
        description="The overview is intentionally short enough to use mid-game. Open a step only when you need the extra location or setup details."
      >
        <GuideStepList>
          {mobRun.map((item, index) => {
            const isOpen = openStep === index;
            return (
              <button
                key={item.title}
                type="button"
                className={`mob-run-step ${isOpen ? 'is-open' : ''}`}
                onClick={() => setOpenStep(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <GuideStepCard
                  step={index + 1}
                  label="Main Quest"
                  title={item.title}
                  summary={item.summary}
                >
                  {isOpen && (
                    <ul className="mob-step-details">
                      {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  )}
                </GuideStepCard>
              </button>
            );
          })}
        </GuideStepList>
      </GuideSection>
    </main>
  );
};

export default MobMain;
