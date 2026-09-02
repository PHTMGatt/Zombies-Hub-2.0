import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const RevealBlueprint = () => (
  <main className="zets-detail-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Reveal the Elevator Quest"
      description="Use the Skull of Nan Sapwe to expose the hidden blueprint and elevator machinery before you start hunting the three cogs."
    >
      <GuideChip>Skull of Nan Sapwe</GuideChip>
      <GuideChip>Mesmerize</GuideChip>
      <GuideChip>3-cog objective</GuideChip>
    </GuideHero>

    <GuideCallout label="You are ready when" tone="info" className="zets-detail-note">
      The concealed elevator machinery is visible and the panel shows three missing cog positions. At that point the three cog routes are your next objective.
    </GuideCallout>

    <GuideSection kicker="Quest Trigger" title="Reveal it in two moves">
      <GuideStepList>
        <GuideStepCard
          step={1}
          label="Mesmerize"
          title="Reveal the blueprint"
          summary="Use the Skull of Nan Sapwe on the hidden/torn blueprint in the bunker area to expose the quest information."
        />
        <GuideStepCard
          step={2}
          label="Mesmerize"
          title="Reveal the elevator machinery"
          summary="Use Mesmerize again on the concealed wall/panel by the elevator so the broken machinery and three missing cog slots are exposed."
        />
      </GuideStepList>
    </GuideSection>
  </main>
);

export default RevealBlueprint;
