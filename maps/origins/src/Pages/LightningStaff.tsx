import React from "react";
import ReviveIcon from "../assets/images/Skull.png";
import LightningCode from "../assets/images/lightning_staff_code.png";
import "../Styles/PageStyles/LightningStaff.css";

const LightningStaff = () => {
  return (
    <div className="lightning-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Lightning Staff Parts
            </h2>
            <ul>
              <li>Part 1: On the tank path, near Generator 2 (jump off)</li>
              <li>Part 2: On the tank path, near Generator 3 (jump off)</li>
              <li>Part 3: Final piece also on tank route (must ride multiple times)</li>
              <li>Purple Record: Near Generator 4 or on tank path</li>
              <li>Gramophone: Inside Excavation Site</li>
            </ul>
          </section>

          <section className="staff-section image-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Piano Code Chart
            </h2>
            <img src={LightningCode} alt="Lightning Code" className="lightning-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Puzzle Notes
            </h2>
            <ul>
              <li>Go through Lightning Tunnel with Gramophone</li>
              <li>Enter Crazy Place and solve the piano note puzzle</li>
              <li>Use code: 1-3-6 / 3-5-7 / 2-4-6</li>
              <li>Align purple lights inside Excavation Site (turn all rings)</li>
              <li>Shoot orb underneath with Lightning Staff</li>
              <li>Place staff on pedestal in Crazy Place & get kills</li>
            </ul>
          </section>

          <aside className="switch-speedrun">
            <h3>⚡ Switch Speed Run</h3>
            <p className="codes"><strong>Codes:</strong> 1-3-6 / 3-5-7 / 2-4-6</p>
            <ul>
              <li>Spawn – Left</li>
              <li>Gen 2 – Down</li>
              <li>Gen 4 – Up</li>
              <li>Gen 5 – Down</li>
              <li>Outside Church – Up</li>
              <li>Bottom Church – Right</li>
              <li>Top Church – Up</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LightningStaff;
