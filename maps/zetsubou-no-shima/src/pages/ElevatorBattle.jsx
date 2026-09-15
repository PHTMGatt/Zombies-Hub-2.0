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
      description="Install the three cogs, descend with Gas Masks, clear the vines with the Masamune, then destroy all four Giant Thrasher spores with Masamune shots."
    >
      <GuideChip>3 cogs</GuideChip>
      <GuideChip>Fresh Gas Mask</GuideChip>
      <GuideChip>Masamune</GuideChip>
    </GuideHero>

    <GuideCallout label="Before entering" tone="info" className="zets-detail-note">
      In co-op, every player should enter with a fresh Gas Mask. Bring the Masamune and a strong close-range weapon; the Masamune is mandatory for the boss spores. Once you go down, play for movement and survival rather than standing still for damage.
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
          summary="Shoot the first glowing orange spore with the Masamune to start the fight, then keep rotating around the arena while you wait for the next spore."
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
          summary="Four spores appear one at a time. Hit each glowing spore with the Masamune; after the fourth successful hit, the Giant Thrasher dies and Seeds of Doubt completes."
        />
      </GuideStepList>
    </GuideSection>
  </main>
);

export default ElevatorBattle;
