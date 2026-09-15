import React from "react";
import ReviveIcon from "../assets/images/Skull.png";
import LightningCode from "../assets/images/lightning_staff_code.png";
import {
  originsExcavationRingReference,
  originsLightningPianoCode,
  originsLightningSwitchRoute,
  originsLightningSwitchVerification,
} from "../../../../shared/data/originsLightning";
import "../Styles/PageStyles/LightningStaff.css";

const LightningStaff = () => {
  return (
    <div className="lightning-staff">
      <div className="lightning-guide-shell">
        <section className="lightning-guide-card lightning-guide-card--build">
          <div className="lightning-guide-heading">
            <span>BUILD</span>
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" />
              Staff of Lightning
            </h2>
          </div>

          <div className="lightning-build-grid">
            <div>
              <strong>3 Tank Parts</strong>
              <ol>
                <li>Church → Gen 2: jump right to the wooden staircase/robot footprint after passing Gen 4.</li>
                <li>Gen 2 → Church: jump left to the Excavation scaffolding and follow it into the mound.</li>
                <li>Gen 2 → Church: jump right just before church and follow the path into the upper church wall.</li>
              </ol>
            </div>

            <div>
              <strong>Record + Crystal</strong>
              <ul>
                <li>Purple record: one of three spawns around Generator 4 / Jug / Wind Tunnel.</li>
                <li>Take the Gramophone + purple record to the Lightning Tunnel beside Generator 5.</li>
                <li>Grab the purple crystal in the Crazy Place, then build the staff beneath Excavation.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="lightning-guide-card lightning-guide-card--piano">
          <div className="lightning-guide-heading">
            <span>UPGRADE 01</span>
            <h2>Piano Code</h2>
          </div>

          <div className="lightning-piano-layout">
            <img src={LightningCode} alt="Origins Lightning Staff piano code" className="lightning-code" />
            <div className="lightning-piano-code">
              {originsLightningPianoCode.map((sequence) => (
                <strong key={sequence.join("-")}>{sequence.join(" · ")}</strong>
              ))}
              <small>Wait for the electrical effect from each set to clear before entering the next set.</small>
            </div>
          </div>
        </section>

        <section className="lightning-guide-card lightning-guide-card--switches">
          <div className="lightning-guide-heading">
            <span>UPGRADE 02 · SPEEDRUN</span>
            <h2>7 Dial Pre-Set</h2>
            <p>{originsLightningSwitchVerification.clickRule}</p>
          </div>

          <div className="lightning-switch-strip" aria-label="Lightning Staff dial speedrun settings">
            {originsLightningSwitchRoute.map((item) => (
              <article className="lightning-switch-chip" key={item.id}>
                <span className="lightning-switch-count">×{item.turnsFromUntouched}</span>
                <strong>{item.shortLabel}</strong>
                <span className="lightning-switch-direction">{item.arrow} {item.direction}</span>
                <small>{item.location}</small>
              </article>
            ))}
          </div>

          <div className="lightning-switch-note">
            <strong>Visual rule:</strong>
            <span>{originsLightningSwitchVerification.rule}</span>
            <span>{originsLightningSwitchVerification.guideConvention}</span>
            <span>{originsLightningSwitchVerification.note}</span>
          </div>
        </section>

        <section className="lightning-guide-card lightning-guide-card--rings">
          <div className="lightning-guide-heading">
            <span>UPGRADE 03</span>
            <h2>Excavation Rings → Purple</h2>
          </div>

          <div className="lightning-ring-grid">
            {originsExcavationRingReference.levers.map((lever, index) => (
              <div key={lever}>
                <span>{index + 1}</span>
                <p>{lever}</p>
              </div>
            ))}
          </div>

          <p className="lightning-ring-finish">
            <strong>Finish:</strong> {originsExcavationRingReference.goal} Then return to the Crazy Place, place the staff on the purple pedestal, and feed souls until the upgrade completes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LightningStaff;
