import React from "react";
import ReviveIcon from "../assets/images/Skull2.png";
import FireCode from "../assets/images/fire_staff_code.png";
import "../Styles/PageStyles/FireStaff.css";

const FireStaff = () => {
  return (
    <div className="fire-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Fire Staff Parts
            </h2>
            <ul>
              <li><strong>Part 1:</strong> Activate all six generators, then collect the staff part from the reward chest beside Generator 6.</li>
              <li><strong>Part 2:</strong> Kill the first Panzer Soldat (normally Round 8) and pick up the part it drops.</li>
              <li><strong>Part 3:</strong> After the church path is open, shoot down the orange glowing plane and collect the fallen part near the Excavation mound.</li>
              <li><strong>Red Record:</strong> Check its three spawn points in the Church / Generator 6 area.</li>
              <li><strong>Crystal:</strong> Take the red record and Gramophone to the Fire Tunnel near spawn, enter the Crazy Place, and collect the red crystal.</li>
              <li><strong>Build:</strong> Use the red pedestal beneath the Excavation Site.</li>
            </ul>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Fire Staff Upgrade Puzzle
            </h2>
            <ul>
              <li>In the Crazy Place, kill zombies on the metal grates beside the Fire area until all four fire cauldrons are lit.</li>
              <li>Read the illuminated fire symbols and use the code chart to translate them into the numbered torches in the Church.</li>
              <li>Go to the Church and shoot the matching numbered torches with the Fire Staff before the puzzle resets.</li>
            </ul>
            <img src={FireCode} alt="Fire Staff Code" className="fire-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Fire Staff Upgrade
            </h2>
            <ul>
              <li>At the Excavation Site, use the four levers to align every ring to RED.</li>
              <li>Go below the rings and shoot the red orb with the Fire Staff.</li>
              <li>Return to the Crazy Place and place the Fire Staff on the red pedestal.</li>
              <li>Kill zombies around the pedestal until the staff is fully charged, then pick it up.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FireStaff;
