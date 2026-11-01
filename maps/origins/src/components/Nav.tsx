import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull, GiStopwatch } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

// Six equal plates: the guide, the four staffs in their own colours, and Speed Run. On phones the
// labels shorten so every plate fits one row; the full name stays as the accessible label.
const PLATES = [
  { to: "/maps/origins", label: "Guide", end: true, Icon: GiCrownedSkull },
  { to: "/maps/origins/ice-staff", label: "Ice", staff: "ice", Icon: FaRegSnowflake },
  { to: "/maps/origins/fire-staff", label: "Fire", staff: "fire", Icon: GiFireTail },
  { to: "/maps/origins/wind-staff", label: "Wind", staff: "wind", Icon: GiWhirlwind },
  { to: "/maps/origins/lightning-staff", label: "Lightning", short: "Light", staff: "lightning", Icon: GiLightningHelix },
  { to: "/maps/origins/speed-run", label: "Speed Run", short: "Speed", staff: "speed", Icon: GiStopwatch },
];

const Nav = () => (
  <nav className="origins-plates" aria-label="Origins guide" data-pinned>
    {PLATES.map(({ to, label, short, end, staff, Icon }) => (
      <NavLink key={to} to={to} end={end} className="origins-plate" data-staff={staff} aria-label={label}>
        <Icon aria-hidden="true" />
        {short ? (
          <span aria-hidden="true"><span className="origins-plate__long">{label}</span><span className="origins-plate__short">{short}</span></span>
        ) : (
          <span aria-hidden="true">{label}</span>
        )}
      </NavLink>
    ))}
  </nav>
);

export default Nav;
