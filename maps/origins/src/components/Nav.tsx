import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull } from "react-icons/gi";
import "../Styles/ComponentStyles/Nav.css";

const Nav = () => {
  const { pathname } = useLocation();
  const linksRef = useRef<HTMLDivElement>(null);

  // On phones the staff tabs are a swipeable row; keep the current staff in view.
  // Only the row scrolls (never the page), and nothing happens when every tab already fits.
  useEffect(() => {
    const row = linksRef.current;
    const active = row?.querySelector<HTMLElement>(".origins-nav-link.active");
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    row.scrollLeft += activeBox.left - rowBox.left - (rowBox.width - activeBox.width) / 2;
  }, [pathname]);

  return (
    <nav className="origins-nav" aria-label="Origins guide navigation">
      <div className="origins-nav-links" ref={linksRef}>
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
