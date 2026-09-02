import React from 'react';
import { GuideChip, GuideHero } from '../../../../shared/ui/GuideLayout';
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
      description="Prime the teleporter, find four active wisps, teleport to the past, then repeat once more later in the quest."
    >
      <GuideChip>8 possible objects</GuideChip>
      <GuideChip>4 hits per cycle</GuideChip>
      <GuideChip>2 cycles</GuideChip>
    </GuideHero>

    <section className="de-wisp-sheet">
      <div className="de-wisp-section">
        <h2>How the Cycle Works</h2>
        <ol className="de-wisp-rules">
          <li><strong>Prime:</strong> Shoot all six teleporter prongs with the base Wrath of the Ancients until they glow orange/gold.</li>
          <li><strong>Swap:</strong> Use an upgraded bow to shoot the active wisp object.</li>
          <li><strong>Hunt:</strong> The wisp moves after every hit. Find four total before the timer expires.</li>
          <li><strong>Teleport:</strong> After the fourth hit, the teleporter turns purple. Send the team through together.</li>
        </ol>
        <p className="de-wisp-warning">If the cycle fails, wait for the next round and prime the teleporter again.</p>
      </div>

      <div className="de-wisp-section">
        <h2>8 Possible Wisp Objects</h2>
        <div className="de-wisp-grid">
          {wispLocations.map(([area, detail], index) => (
            <div key={area} className="de-wisp-location">
              <span>{index + 1}</span>
              <div><strong>{area}</strong><small>{detail}</small></div>
            </div>
          ))}
        </div>
      </div>

      <div className="de-wisp-trip-grid">
        <section>
          <h2>First Trip</h2>
          <ul>
            <li>Collect the blue soul canister.</li>
            <li>Collect the small fuses.</li>
            <li>Memorize the three safe symbols top-to-bottom.</li>
          </ul>
        </section>
        <section>
          <h2>Second Trip</h2>
          <ul>
            <li>Repeat the six-prong + four-wisp cycle.</li>
            <li>Use the past-lab interaction to open the Keeper Stone case.</li>
            <li>Collect the Keeper Stone before you are returned.</li>
          </ul>
        </section>
      </div>

      <details className="de-wisp-video-reference">
        <summary>Open video reference</summary>
        <div className="de-wisp-video">
          <iframe
            src="https://www.youtube.com/embed/NhDv6R5YPEs?start=121&rel=0&modestbranding=1"
            title="Der Eisendrache wisp step reference"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </details>
    </section>
  </main>
);

export default Wisp;
