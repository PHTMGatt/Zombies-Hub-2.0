import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

// The guide and the four staffs: each tab owns its own information. Speed Run is not a tab; it is linked
// from the Main Guide.
const TABS = [
  { to: "/maps/origins", label: "Main Guide", end: true, staff: "guide", Icon: GiCrownedSkull },
  { to: "/maps/origins/ice-staff", label: "Ice Staff", staff: "ice", Icon: FaRegSnowflake },
  { to: "/maps/origins/fire-staff", label: "Fire Staff", staff: "fire", Icon: GiFireTail },
  { to: "/maps/origins/wind-staff", label: "Wind Staff", staff: "wind", Icon: GiWhirlwind },
  { to: "/maps/origins/lightning-staff", label: "Lightning Staff", staff: "lightning", Icon: GiLightningHelix },
];

const Nav = () => (
  <nav className="origins-plates" aria-label="Origins guide">
    {TABS.map(({ to, label, end, staff, Icon }) => (
      <NavLink key={to} to={to} end={end} className="origins-plate" data-staff={staff}>
        <Icon aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default Nav;
