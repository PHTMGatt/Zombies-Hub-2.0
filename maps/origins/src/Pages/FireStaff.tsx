import React from "react";
import OGStaffPage from "../components/OGStaffPage";
import FireCode from "../assets/images/fire_staff_code.webp";

// The original Fire Staff page, line for line, except one line: the original's "Use code: 11 - 5 - 9 - 7 - 6 - 3 - 4"
// lists the torch numbers, not an answer, so it points at the chart instead.
const FireStaff = () => (
  <OGStaffPage
    staff="fire"
    left={[
      {
        title: "Fire Staff Parts",
        items: [
          "Part 1: Dropped by Panzer at round 8",
          "Part 2: In the tank path at Church — jump off to reach it",
          "Part 3: In the tank path at spawn — jump off to reach it",
          "Red Record: Near tank station or church",
          "Gramophone: Inside Excavation Site",
        ],
      },
      {
        title: "Crazy Place Puzzle",
        items: [
          "Go through Fire Tunnel with Gramophone",
          "Place Gramophone on red pedestal and enter the portal",
          "Shoot the correct fire symbols on the wall",
          "Use the code chart below",
        ],
        chart: { src: FireCode, alt: "Fire Staff Code", width: 2000, height: 726 },
      },
    ]}
    right={[
      {
        title: "Fire Staff Upgrade",
        items: [
          "Fill four fire cauldrons in Agartha with zombie souls",
          "Return to the Excavation Site",
          "Turn all rings to RED using the levers",
          "Shoot the glowing orb beneath with Fire Staff",
          "Return to Crazy Place and place the staff on red pedestal",
          "Kill zombies nearby to upgrade the staff",
        ],
      },
    ]}
  />
);

export default FireStaff;
