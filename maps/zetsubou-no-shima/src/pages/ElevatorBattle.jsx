import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const ElevatorBattle = () => (
  <main className="zets-detail-page zets-boss-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Elevator + Giant Thrasher"
      description="Install the three cogs, descend with a fresh Gas Mask, open the arena with the Masamune, and repeat the boss damage cycle four times."
    >
      <GuideChip>3 cogs</GuideChip>
      <GuideChip>Fresh Gas Mask</GuideChip>
      <GuideChip>Masamune</GuideChip>
    </GuideHero>

    <GuideCallout label="Before entering" tone="info" className="zets-detail-note">
      Replace a damaged Gas Mask before the descent, bring the Masamune, and take a strong shotgun or another reliable Thrasher-killing weapon. Once you go down, play for movement and survival rather than standing still for damage.
    </GuideCallout>

    <GuideSection kicker="Final Sequence" title="Elevator to ending">
      <GuideStepList>
        <GuideStepCard
          step={1}
          label="Elevator"
          title="Install all three cogs"
          summary="Return to the elevator machinery, place the three recovered cogs, and activate the descent into the lower chamber."
        />
        <GuideStepCard
          step={2}
          label="Masamune"
          title="Clear the vines"
          summary="After the elevator drops, use the Masamune on the glowing vine/spore growths blocking the path into the boss arena."
        />
        <GuideStepCard
          step={3}
          label="Boss Fight"
          title="Start the Giant Thrasher encounter"
          summary="Shoot the first active spore to start the fight, then keep rotating around the arena instead of holding one position."
        >
          <ul className="zets-run-details">
            <li>Use charged Masamune shots to control the ground and keep the arena manageable.</li>
            <li>Use a shotgun or the Skull of Nan Sapwe to delete normal Thrashers when they pressure the route.</li>
            <li>Avoid spiders and keep moving while the next boss spore becomes available.</li>
          </ul>
        </GuideStepCard>
        <GuideStepCard
          step={4}
          label="Damage Cycle"
          title="Destroy all four boss spores"
          summary="The boss weak-point spores become available one at a time. Repeat the same survival-and-damage cycle four times to finish Seeds of Doubt."
        />
      </GuideStepList>
    </GuideSection>
  </main>
);

export default ElevatorBattle;
