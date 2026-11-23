import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

// Exactly the five tabs of the original guide, in its order and with its icons.
const TABS = [
  { to: "/maps/origins", end: true, id: "main", Icon: GiCrownedSkull, label: "Main Guide" },
  { to: "/maps/origins/ice-staff", id: "ice", Icon: FaRegSnowflake, label: "Ice Staff" },
  { to: "/maps/origins/fire-staff", id: "fire", Icon: GiFireTail, label: "Fire Staff" },
  { to: "/maps/origins/wind-staff", id: "wind", Icon: GiWhirlwind, label: "Wind Staff" },
  { to: "/maps/origins/lightning-staff", id: "lightning", Icon: GiLightningHelix, label: "Lightning Staff" },
];

const Nav = () => (
  <nav className="og-nav" aria-label="Origins guide navigation">
    <div className="og-nav__links">
      {TABS.map(({ to, end, id, Icon, label }) => (
        <NavLink
          key={id}
          to={to}
          end={end}
          className={({ isActive }) => `og-nav__link og-nav__link--${id}${isActive ? " active" : ""}`}
        >
          <Icon aria-hidden="true" /> <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Nav;
