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
          <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon" />
          <h1 className="header-title">Origins</h1>
          <span className="origins-header__subtitle">Little Lost Girl</span>
          <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon origins-header__end-icon" />
        </div>

        <div className="header-right">
          <Nav />
        </div>
      </div>
    </header>
  );
};

export default Header;
