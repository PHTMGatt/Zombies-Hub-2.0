import React from 'react';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
  GuideSection,
  GuideStepCard,
  GuideStepList,
} from '../../../../shared/ui/GuideLayout';
import '../styles/pages/Parts.css';

const shieldZones = [
  {
    title: 'Lower Courtyard / Gate Trap',
    spots: ['On the crates past the Gate Trap', 'Around the lower stair / Landing Pad area', 'On the stairs heading toward the Death Ray / Bastion'],
  },
  {
    title: 'Clock Tower / Mission Control',
    spots: ['Against the crates or wall near the Mission Control entrance', 'Near the seated corpse / desk inside the Clock Tower area', 'At the lower side of the Clock Tower stairs'],
  },
  {
    title: 'Undercroft — Anti-Gravity Required',
    spots: ['Above the Pack-a-Punch teleporter position', 'Above the doorway toward the Rocket Test teleporter', 'High on the Pyramid metalwork / above a bow altar'],
  },
];

const Parts: React.FC = () => (
  <main className="de-parts-page">
    <GuideHero
      kicker="Gear & Buildables"
      title="Build It Without Wasting Rounds"
      description="The quest only hard-requires the Ragnaroks at the boss entry, but the Shield is worth building early. Spawn locations are grouped by zone so you can sweep each area once."
    >
      <GuideChip>Rocket Shield</GuideChip>
      <GuideChip>Ragnarok DG-4</GuideChip>
      <GuideChip>Optional Extras</GuideChip>
    </GuideHero>

    <GuideSection
      kicker="Rocket Shield"
      title="Three parts · three spawn zones"
      description="Each Shield part has three possible positions inside its zone. Check the whole zone before moving on instead of bouncing around the castle."
    >
      <div className="de-parts-zone-grid">
        {shieldZones.map((zone, index) => (
          <article key={zone.title} className="de-parts-zone-card">
            <span className="de-parts-zone-card__number">{index + 1}</span>
            <div>
              <h3>{zone.title}</h3>
              <ul>
                {zone.spots.map((spot) => <li key={spot}>{spot}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <GuideCallout label="Build bench">
        Once all three pieces are collected, build the Shield at a workbench such as the Church, Gatehouse / above Double Tap, or Undercroft bench.
      </GuideCallout>
    </GuideSection>

    <GuideSection
      kicker="Required for Boss Entry"
      title="Ragnarok DG-4"
      description="Every player needs a completed Ragnarok before the team can enter the Keeper boss arena. Start collecting these pieces as soon as they become available."
    >
      <GuideStepList>
        <GuideStepCard
          step={1}
          label="Panzer Part"
          title="Kill the first Panzersoldat"
          summary="The first Panzer you kill drops a Ragnarok part. If it is missed, a later Panzer can drop another, so the run is not permanently dead."
        />
        <GuideStepCard
          step={2}
          label="Death Ray Part"
          title="Activate the Death Ray and grab the floating piece"
          summary="Use the Death Ray at least once. A Ragnarok part appears floating above the Bastion / Death Ray area. Use the correct Wundersphere route to catch it while airborne."
        />
        <GuideStepCard
          step={3}
          label="Rocket Test Part"
          title="Arm the Rocket Platform console"
          summary="During a Rocket Test, activate the switch at the bottom of the left stairs closest to the Wundersphere, get into the bunker before the doors close, survive until the teleporter console lights turn solid green, then interact quickly. The part spawns in the teleporter."
        />
        <GuideStepCard
          step={4}
          label="Assembly"
          title="Build the Ragnarok DG-4"
          summary="Take all three pieces to a workbench and build the specialist weapon. In co-op, make sure every player has theirs before the Pyramid boss-entry step."
        />
      </GuideStepList>
      <GuideCallout label="Do not enter early" tone="warning">
        If one player is still missing a Ragnarok, finish that first. The boss-entry tiles are a no-return commitment for the run.
      </GuideCallout>
    </GuideSection>

    <GuideSection
      kicker="Useful Setup"
      title="Low Gravity & Pack-a-Punch"
      description="Several bow and equipment steps happen in the Undercroft, so getting the room fully active early pays off."
    >
      <div className="de-parts-quick-grid">
        <div>
          <strong>Low Gravity</strong>
          <p>Stand on the four Pyramid floor plates until they lock in. The room periodically enters anti-gravity, enabling wall-run steps and the high Shield-part spawns.</p>
        </div>
        <div>
          <strong>Pack-a-Punch</strong>
          <p>Use the three teleporter locations to move the Pack-a-Punch pieces into position. Keep the weapon upgrade available before the boss rather than leaving it for the final rounds.</p>
        </div>
      </div>
    </GuideSection>

    <GuideSection
      kicker="Optional"
      title="Side Gear"
      description="These are not required to complete My Brother’s Keeper. Treat them as run bonuses, not prerequisites."
    >
      <div className="de-parts-optional-grid">
        <a href="https://www.youtube.com/watch?v=jGSTfe_yc0M" target="_blank" rel="noopener noreferrer">
          <span>Optional Helmet</span>
          <strong>Panzer Helmet Guide</strong>
        </a>
        <a href="https://www.youtube.com/watch?v=00sYn4Bj1hM" target="_blank" rel="noopener noreferrer">
          <span>Optional Melee</span>
          <strong>Golden Plunger Guide</strong>
        </a>
      </div>
    </GuideSection>
  </main>
);

export default Parts;
