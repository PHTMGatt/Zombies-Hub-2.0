import React from "react";
import OGStaffPage from "../components/OGStaffPage";
import LightningCode from "../assets/images/lightning_staff_code.webp";

// The original Lightning Staff page, line for line, including its Switch Speed Run box.
const LightningStaff = () => (
  <OGStaffPage
    staff="lightning"
    left={[
      {
        title: "Lightning Staff Parts",
        items: [
          "Part 1: On the tank path, near Generator 2 (jump off)",
          "Part 2: On the tank path, near Generator 3 (jump off)",
          "Part 3: Final piece also on tank route (must ride multiple times)",
          "Purple Record: Near Generator 4 or on tank path",
          "Gramophone: Inside Excavation Site",
        ],
      },
      {
        title: "Piano Code Chart",
        chart: { src: LightningCode, alt: "Lightning Code", width: 2000, height: 1300 },
      },
    ]}
    right={[
      {
        title: "Puzzle Notes",
        items: [
          "Go through Lightning Tunnel with Gramophone",
          "Enter Crazy Place and solve the piano note puzzle",
          "Use code: 1-3-6 / 3-5-7 / 2-4-6",
          "Align purple lights inside Excavation Site (turn all rings)",
          "Shoot orb underneath with Lightning Staff",
          "Place staff on pedestal in Crazy Place & get kills",
        ],
      },
    ]}
    aside={(
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
    )}
  />
);

export default LightningStaff;
