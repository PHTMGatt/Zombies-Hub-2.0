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
      <div className="lightning-layout">
        <div className="lightning-column">
          <section className="lightning-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Build the Lightning Staff
            </h2>

            <h3>3 Tank Parts</h3>
            <ol className="lightning-list">
              <li>
                <strong>Church → Gen 2:</strong> jump right after passing Generator 4 to land by the wooden
                staircase / robot footprint.
              </li>
              <li>
                <strong>Gen 2 → Church:</strong> jump left onto the Excavation scaffolding and follow the path
                into the mound.
              </li>
              <li>
                <strong>Gen 2 → Church:</strong> jump right just before the Church and follow the upper path
                into the Church wall.
              </li>
            </ol>

            <h3>Record + Crystal</h3>
            <ul className="lightning-list">
              <li>Purple record: one of three spawns around Generator 4 / Jug / Wind Tunnel.</li>
              <li>Take the Gramophone and purple record to the Lightning Tunnel beside Generator 5.</li>
              <li>Grab the purple crystal in the Crazy Place, then build the staff beneath Excavation.</li>
            </ul>
          </section>

          <section className="lightning-section lightning-code-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Piano Code
            </h2>

            <img
              src={LightningCode}
              alt="Origins Lightning Staff piano code"
              className="lightning-code"
            />

            <div className="lightning-code-lines" aria-label="Lightning Staff piano code">
              {originsLightningPianoCode.map((sequence) => (
                <strong key={sequence.join("-")}>{sequence.join(" - ")}</strong>
              ))}
            </div>
            <p className="lightning-help">
              Enter each group separately and wait for the electrical effect to clear before starting the next one.
            </p>
          </section>
        </div>

        <div className="lightning-column">
          <section className="lightning-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Switch Positions
            </h2>

            <div className="lightning-switch-list">
              {originsLightningSwitchRoute.map((item) => (
                <div className="lightning-switch-row" key={item.id}>
                  <div>
                    <strong>{item.shortLabel}</strong>
                    <small>{item.location}</small>
                  </div>
                  <span>{item.arrow} {item.direction}</span>
                </div>
              ))}
            </div>

            <p className="lightning-help lightning-help--switches">
              <strong>Direction shown:</strong> {originsLightningSwitchVerification.rule}
            </p>
          </section>

          <section className="lightning-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Finish the Upgrade
            </h2>

            <ol className="lightning-list">
              {originsExcavationRingReference.levers.map((lever) => (
                <li key={lever}>{lever}</li>
              ))}
            </ol>

            <p className="lightning-finish">
              <strong>Then:</strong> {originsExcavationRingReference.goal}
            </p>
            <p className="lightning-finish">
              Return to the Crazy Place, place the staff on the purple pedestal, and feed souls until the
              upgraded Lightning Staff is ready.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LightningStaff;
