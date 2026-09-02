import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

const Nav = () => {
  return (
    <nav className="origins-nav">
      <div className="origins-nav-links">
        <NavLink
          to="/maps/origins"
          end
          className={({ isActive }) =>
            `origins-nav-link main ${isActive ? "active main-active" : ""}`
          }
        >
          <GiCrownedSkull /> <span>Main Guide</span>
        </NavLink>

        <NavLink
          to="/maps/origins/ice-staff"
          className={({ isActive }) =>
            `origins-nav-link ice ${isActive ? "active ice-active" : ""}`
          }
        >
          <FaRegSnowflake /> <span>Ice Staff</span>
        </NavLink>

        <NavLink
          to="/maps/origins/fire-staff"
          className={({ isActive }) =>
            `origins-nav-link fire ${isActive ? "active fire-active" : ""}`
          }
        >
          <GiFireTail /> <span>Fire Staff</span>
        </NavLink>

        <NavLink
          to="/maps/origins/wind-staff"
          className={({ isActive }) =>
            `origins-nav-link wind ${isActive ? "active wind-active" : ""}`
          }
        >
          <GiWhirlwind /> <span>Wind Staff</span>
        </NavLink>

        <NavLink
          to="/maps/origins/lightning-staff"
          className={({ isActive }) =>
            `origins-nav-link lightning ${isActive ? "active lightning-active" : ""}`
          }
        >
          <GiLightningHelix /> <span>Lightning Staff</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
