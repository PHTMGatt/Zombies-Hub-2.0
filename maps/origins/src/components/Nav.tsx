import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

// Exactly the five tabs of the original guide. `rest` is the second word, dropped on narrow screens so the row never wraps.
const TABS = [
  { to: "/maps/origins", end: true, id: "main", Icon: GiCrownedSkull, label: "Main", rest: "Guide", keepRest: true },
  { to: "/maps/origins/ice-staff", id: "ice", Icon: FaRegSnowflake, label: "Ice", rest: "Staff" },
  { to: "/maps/origins/fire-staff", id: "fire", Icon: GiFireTail, label: "Fire", rest: "Staff" },
  { to: "/maps/origins/wind-staff", id: "wind", Icon: GiWhirlwind, label: "Wind", rest: "Staff" },
  { to: "/maps/origins/lightning-staff", id: "lightning", Icon: GiLightningHelix, label: "Lightning", rest: "Staff" },
];

const Nav = () => (
  <nav className="og-nav" aria-label="Origins guide navigation">
    {TABS.map(({ to, end, id, Icon, label, rest, keepRest }) => (
      <NavLink
        key={id}
        to={to}
        end={end}
        aria-label={`${label} ${rest}`}
        className={({ isActive }) => `og-nav__link og-nav__link--${id}${isActive ? " active" : ""}`}
      >
        <Icon aria-hidden="true" />
        <span>
          {label}
          <span className={keepRest ? undefined : "og-nav__rest"}> {rest}</span>
        </span>
      </NavLink>
    ))}
  </nav>
);

export default Nav;
