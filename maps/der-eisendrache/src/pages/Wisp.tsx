import React from 'react';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
  GuideSection,
  GuideStepCard,
  GuideStepList,
} from '../../../../shared/ui/GuideLayout';
import '../styles/pages/Wisp.css';

const wispLocations = [
  ['Spawn / Quick Revive', 'Phone on the table in front of the Quick Revive side of spawn.'],
  ['Spawn → Double Tap', 'Front wheel / tire of the broken car on the route toward Double Tap.'],
  ['Above Double Tap', 'Cabinet / box in the room above Double Tap.'],
  ['Samantha / Richtofen Rooms', 'Globe in the bedroom / study area past Samantha’s room.'],
  ['Power Room', 'Phone in the Power Switch room.'],
  ['Mission Control', 'Clock above / near the dragon in Mission Control.'],
  ['Lower Mission Control', 'Radio / machinery object on the lower floor of Mission Control.'],
  ['Courtyard / Clock Tower Route', 'Clock on the upstairs route out of the courtyard toward the Clock Tower.'],
];

const Wisp: React.FC = () => (
  <main className="de-wisp-page">
    <GuideHero
      kicker="Teleporter Puzzle"
      title="Wisp Cycles"
      description="You do this twice during the main quest. Prime the teleporter with the base bow, then hunt four active wisps with an upgraded bow."
    >
      <GuideChip>8 possible objects</GuideChip>
      <GuideChip>4 hits per cycle</GuideChip>
      <GuideChip>2 cycles total</GuideChip>
    </GuideHero>

    <GuideSection kicker="Before the Hunt" title="Prime the teleporter correctly">
      <GuideStepList>
        <GuideStepCard
          step={1}
          label="Base Bow"
          title="Shoot all six teleporter prongs"
          summary="Use the BASE Wrath of the Ancients on the six electrical prongs above the teleporter until they glow orange/gold and the sound cue plays."
        />
        <GuideStepCard
          step={2}
          label="Upgraded Bow"
          title="Switch bows before searching"
          summary="The active wisp objects are shot with an upgraded elemental bow. Only one wisp is active at a time."
        />
        <GuideStepCard
          step={3}
          label="Timer"
          title="Find four before the cycle expires"
          summary="After every successful hit, the next wisp moves to another object. Find four total. When the fourth is hit, the teleporter turns purple."
        />
      </GuideStepList>
      <GuideCallout label="Failure rule" tone="warning">
        If the cycle times out or you break the setup, wait for the next round and prime the teleporter again. Do not keep shooting random objects hoping the puzzle is still active.
      </GuideCallout>
    </GuideSection>

    <GuideSection
      kicker="Scan Route"
      title="All 8 possible wisp objects"
      description="Run a consistent loop instead of crisscrossing the castle. The object glows / crackles when it is the current active wisp."
    >
      <div className="de-wisp-grid">
        {wispLocations.map(([area, detail], index) => (
          <article key={area} className="de-wisp-card">
            <span>{index + 1}</span>
            <div>
              <strong>{area}</strong>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </GuideSection>

    <GuideSection kicker="First Cycle" title="What to grab in the past">
      <div className="de-wisp-trip-grid">
        <div><strong>Blue Soul Canister</strong><span>Needed later for the Moon Pyramid Device.</span></div>
        <div><strong>Small Fuses</strong><span>Used at the Death Ray before entering the safe code.</span></div>
        <div><strong>3 Safe Symbols</strong><span>Memorize them top-to-bottom. They change every game.</span></div>
      </div>
      <GuideCallout label="All players">
        When the teleporter turns purple, send the whole team through together. Treat the time-travel room like a timed loot stop, not a sightseeing break.
      </GuideCallout>
    </GuideSection>

    <GuideSection kicker="Second Cycle" title="What changes the second time">
      <GuideStepList>
        <GuideStepCard
          step={1}
          label="Repeat"
          title="Prime six prongs and hit four wisps again"
          summary="The object pool is the same. Complete another successful four-wisp cycle and enter the purple teleporter with the team."
        />
        <GuideStepCard
          step={2}
          label="Past Lab"
          title="Open the Keeper Stone case"
          summary="Use the quest computer / key-card interaction in the past laboratory to open the case, then collect the Keeper Stone / tablet before you are returned."
        />
        <GuideStepCard
          step={3}
          label="Next"
          title="Move straight into the Keeper ritual"
          summary="Back in the present, the Vril Generator and Keeper Stone feed directly into the ghost Keeper sequence on the Main Quest page."
        />
      </GuideStepList>
    </GuideSection>

    <GuideSection kicker="Video Reference" title="Wisp section in context">
      <div className="de-wisp-video">
        <iframe
          src="https://www.youtube.com/embed/NhDv6R5YPEs?start=121&rel=0&modestbranding=1"
          title="Der Eisendrache wisp step reference"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </GuideSection>
  </main>
);

export default Wisp;
