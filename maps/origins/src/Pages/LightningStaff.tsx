import React from "react";
import ReviveIcon from "../assets/images/Skull.png";
import LightningCode from "../assets/images/lightning_staff_code.png";
import {
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
                <strong>Church → Gen 2:</strong> jump right after Generator 4.
              </li>
              <li>
                <strong>Gen 2 → Church:</strong> jump left onto Excavation scaffolding.
              </li>
              <li>
                <strong>Gen 2 → Church:</strong> jump right just before Church.
              </li>
            </ol>

            <h3>Record + Crystal</h3>
            <ul className="lightning-list">
              <li>Purple record: Generator 4 / Jug / Wind Tunnel area.</li>
              <li>Open the Lightning Tunnel beside Generator 5.</li>
              <li>Grab the purple crystal, then build the staff under Excavation.</li>
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
              Wait for the electrical effect to clear between each group.
            </p>
          </section>
        </div>

        <div className="lightning-column">
          <section className="lightning-section lightning-switch-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Switch Positions
            </h2>

            <div className="lightning-switch-list" aria-label="Lightning Staff switch positions">
              {originsLightningSwitchRoute.map((item) => (
                <div className="lightning-switch-row" key={item.id}>
                  <strong>{item.shortLabel}</strong>
                  <span>{item.arrow} {item.direction}</span>
                </div>
              ))}
            </div>

            <details className="lightning-details">
              <summary>Need exact switch locations?</summary>
              <div className="lightning-location-list">
                {originsLightningSwitchRoute.map((item) => (
                  <p key={item.id}>
                    <strong>{item.shortLabel}:</strong> {item.location}
                  </p>
                ))}
              </div>
              <p className="lightning-arrow-note">
                {originsLightningSwitchVerification.rule}
              </p>
            </details>
          </section>

          <section className="lightning-section lightning-finish-section">
            <h2>
              <img src={ReviveIcon} className="lightning-revive-icon" alt="" />
              Finish the Upgrade
            </h2>

            <ol className="lightning-finish-steps">
              <li>Under Excavation, line up all 4 rings <strong>purple</strong>.</li>
              <li>Shoot the purple orb underneath with the Lightning Staff.</li>
              <li>Return it to the purple Crazy Place pedestal and feed souls.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LightningStaff;
