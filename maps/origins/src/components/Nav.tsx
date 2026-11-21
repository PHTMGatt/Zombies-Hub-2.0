import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

// Owner spec 2026-11-21 (mockup A): the OG Origins tabs only. No OG/UI toggle, no Step details,
// no Speed Run (Speed Run lives under Side EEs). Tabs wrap; they never clip or scroll sideways.
const TABS = [
  { to: "/maps/origins", end: true, cls: "main", label: "Main Guide", Icon: GiCrownedSkull },
  { to: "/maps/origins/ice-staff", cls: "ice", label: "Ice Staff", Icon: FaRegSnowflake },
  { to: "/maps/origins/fire-staff", cls: "fire", label: "Fire Staff", Icon: GiFireTail },
  { to: "/maps/origins/wind-staff", cls: "wind", label: "Wind Staff", Icon: GiWhirlwind },
  { to: "/maps/origins/lightning-staff", cls: "lightning", label: "Lightning Staff", Icon: GiLightningHelix },
];

const Nav = () => (
  <nav className="origins-nav" aria-label="Origins guide navigation">
    <div className="origins-nav-links">
      {TABS.map(({ to, end, cls, label, Icon }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `origins-nav-link ${cls} ${isActive ? `active ${cls}-active` : ""}`}>
          <Icon aria-hidden="true" /> <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Nav;
