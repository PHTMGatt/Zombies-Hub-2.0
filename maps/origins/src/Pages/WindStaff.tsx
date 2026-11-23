import React from "react";
import OGStaffPage from "../components/OGStaffPage";
import WindCode from "../assets/images/wind_staff_code.webp";

// The original Wind Staff page, line for line.
const WindStaff = () => (
  <OGStaffPage
    staff="wind"
    left={[
      {
        title: "Wind Staff Parts",
        items: [
          "Part 1: Inside the robot that steps near spawn",
          "Part 2: Inside the robot that steps middle (excavation)",
          "Part 3: Inside the robot that steps near church",
          "Yellow Record: Near Generator 5 (Stamin-Up or around wind tunnel)",
          "Gramophone: Inside Excavation Site",
        ],
      },
      {
        title: "Wind Puzzle Code",
        chart: { src: WindCode, alt: "Wind Code Chart", width: 2000, height: 1300 },
      },
    ]}
    right={[
      {
        title: "Puzzle Notes",
        items: [
          "Open the Wind Tunnel with the Gramophone",
          "Enter the Crazy Place",
          "Shoot the Wind Puzzle Code on the wall",
          "Align yellow rings in Excavation Site",
          "Shoot the orb below with Wind Staff",
          "Place Wind Staff in pedestal and kill zombies to upgrade",
        ],
      },
    ]}
  />
);

export default WindStaff;
