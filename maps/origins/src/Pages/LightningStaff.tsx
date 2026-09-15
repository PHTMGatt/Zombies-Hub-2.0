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
  const switchSummary = originsLightningSwitchRoute
    .map((item) => `${item.shortLabel} ${item.arrow} ${item.direction}`)
    .join(" · ");

  return (
    <div className="lightning-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Lightning Staff Parts
            </h2>
            <ul>
              <li><strong>Part 1:</strong> Church → Gen 2, jump right after Generator 4.</li>
              <li><strong>Part 2:</strong> Gen 2 → Church, jump left onto Excavation scaffolding.</li>
              <li><strong>Part 3:</strong> Gen 2 → Church, jump right just before Church.</li>
              <li><strong>Purple Record:</strong> Generator 4 / Jug / Wind Tunnel area.</li>
              <li><strong>Crystal:</strong> Lightning Tunnel beside Generator 5 → Crazy Place.</li>
            </ul>
          </section>

          <section className="staff-section image-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Piano Code Chart
            </h2>
            <img src={LightningCode} alt="Lightning Staff piano code" className="lightning-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Puzzle Notes
            </h2>
            <ul>
              <li>
                Play the piano code:{" "}
                <strong>{originsLightningPianoCode.map((sequence) => sequence.join("-")).join(" / ")}</strong>.
              </li>
              <li><strong>Switches:</strong> {switchSummary}.</li>
              <li>Under Excavation, line all four rings up <strong>purple</strong>.</li>
              <li>Shoot the purple orb underneath with the Lightning Staff.</li>
              <li>Return the staff to the purple Crazy Place pedestal and feed souls.</li>
            </ul>

            <details className="switch-location-details">
              <summary>Exact switch locations</summary>
              <div className="switch-location-list">
                {originsLightningSwitchRoute.map((item) => (
                  <p key={item.id}>
                    <strong>{item.shortLabel}:</strong> {item.location}
                  </p>
                ))}
              </div>
              <p className="switch-direction-note">{originsLightningSwitchVerification.rule}</p>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LightningStaff;
