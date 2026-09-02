import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { gorodBossPhases } from '../data/gorodRun';
import '../styles/BossFight.css';

const BossFight = () => (
  <main className="gorod-boss-page">
    <GuideHero
      kicker="Gorod Krovi"
      title="Dragon + Nikolai Boss Fight"
      description="A focused battle page for the final two phases of Love and War, stripped down to the actions you need once you step onto the arena grate."
    >
      <GuideChip>Ray Gun Mark 3 recommended</GuideChip>
      <GuideChip>Fresh shield</GuideChip>
      <GuideChip>In Plain Sight recommended</GuideChip>
    </GuideHero>

    <GuideCallout label="Before entering" tone="info" className="gorod-boss-note">
      The transcript’s loadout recommendation is simple: strong perks, a Pack-a-Punched Ray Gun Mark 3, a shield, and In Plain Sight. Once you enter, there is no reason to keep the rest of the quest information on screen.
    </GuideCallout>

    <GuideSection
      kicker="Final Battle"
      title="Two phases. Keep it simple."
      description="Use the cards in order. Phase one is about surviving dragon fire and hitting exposed weak points; phase two is about deleting Nikolai’s mech quickly."
    >
      <GuideStepList>
        {gorodBossPhases.map((phase, index) => (
          <GuideStepCard
            key={phase.title}
            step={index + 1}
            label="Boss Phase"
            title={phase.title}
            summary={phase.summary}
          >
            <ul className="gorod-boss-details">
              {phase.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </GuideStepCard>
        ))}
      </GuideStepList>
    </GuideSection>
  </main>
);

export default BossFight;
