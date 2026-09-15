import React from "react";
import ReviveIcon from "../assets/images/Skull.png";
import LightningCode from "../assets/images/lightning_staff_code.png";
import { originsLightningSwitchRoute } from "../../../../shared/data/originsLightning";
import "../Styles/PageStyles/LightningStaff.css";

const LightningStaff = () => {
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
              <li><strong>Gramophone:</strong> Inside Excavation Site.</li>
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
              <li>Go through the Lightning Tunnel with the Gramophone.</li>
              <li>Enter the Crazy Place and solve the piano note puzzle.</li>
              <li>Use code: <strong>1-3-6 / 3-5-7 / 2-4-6</strong>.</li>
              <li>Line all four rings up <strong>purple</strong> under Excavation.</li>
              <li>Shoot the orb underneath with the Lightning Staff.</li>
              <li>Place the staff on the purple Crazy Place pedestal and feed souls.</li>
            </ul>
          </section>

          <aside className="switch-speedrun">
            <h3>⚡ Switch Positions</h3>
            <ul>
              {originsLightningSwitchRoute.map((item) => (
                <li key={item.id}>
                  <strong>{item.shortLabel}</strong> — {item.arrow} {item.direction}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LightningStaff;
