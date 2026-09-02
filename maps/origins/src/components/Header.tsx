import React from "react";
import ReviveIcon from "../assets/images/Revive_Icon.png";
import Nav from "./Nav";
import "../Styles/ComponentStyles/Header.css";

const Header = () => {
  return (
    <header className="site-header origins-map-header">
      <div className="origins-header__backdrop" aria-hidden="true" />

      <div className="origins-header__content">
        <div className="origins-header__identity">
          <span className="origins-header__kicker">Zombies Hub 2.0 · Black Ops II</span>

          <div className="origins-header__title-row">
            <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon" />
            <div>
              <h1 className="header-title">Origins</h1>
              <p className="origins-header__subtitle">Little Lost Girl</p>
            </div>
            <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon" />
          </div>
        </div>

        <div className="header-right">
          <Nav />
        </div>
      </div>
    </header>
  );
};

export default Header;
