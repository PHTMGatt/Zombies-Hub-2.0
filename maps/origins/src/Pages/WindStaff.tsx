import React from "react";
import ReviveIcon from "../assets/images/Skull2.png";
import WindCode from "../assets/images/wind_staff_code.png";
import "../Styles/PageStyles/WindStaff.css";

const WindStaff = () => {
  return (
    <div className="wind-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Wind Staff Parts
            </h2>
            <ul>
              <li><strong>Part 1:</strong> Enter Thor, the robot that walks through the spawn-side trenches.</li>
              <li><strong>Part 2:</strong> Enter Odin, the robot that crosses the middle / Excavation area.</li>
              <li><strong>Part 3:</strong> Enter Freya, the robot that walks through the Church area.</li>
              <li><strong>Yellow Record:</strong> Check the Generator 5 area, including Stamin-Up and the Lightning Tunnel entrance.</li>
              <li><strong>Crystal:</strong> Take the yellow record and Gramophone to the Wind Tunnel near Generator 4, enter the Crazy Place, and collect the yellow crystal.</li>
              <li><strong>Build:</strong> Use the yellow pedestal beneath the Excavation Site.</li>
            </ul>
          </section>

          <section className="staff-section image-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Wind Puzzle Code
            </h2>
            <img src={WindCode} alt="Wind Code Chart" className="wind-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Wind Staff Upgrade
            </h2>
            <ul>
              <li>In the Crazy Place, shoot the four ceiling rings with the Wind Staff until the symbols match the Wind puzzle code.</li>
              <li>Return to the main map and use the Wind Staff on all three smoking chimneys so their smoke points toward the Excavation Site.</li>
              <li>At the Excavation Site, use the four levers to align every ring to YELLOW.</li>
              <li>Go below the rings and shoot the yellow orb with the Wind Staff.</li>
              <li>Return to the Crazy Place and place the Wind Staff on the yellow pedestal.</li>
              <li>Kill zombies around the pedestal until the staff is fully charged, then pick it up.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WindStaff;
