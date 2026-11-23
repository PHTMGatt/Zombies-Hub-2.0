import React from "react";
import ReviveIcon from "../assets/images/Revive_Icon.png";
import Nav from "./Nav";
import "../Styles/ComponentStyles/Header.css";

// The original Origins guide header: centred title with a Revive icon each side, the five tabs in one row under it.
const Header = () => {
  return (
    <header className="site-header origins-map-header">
      <div className="title-box">
        <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon" />
        <h1 className="header-title">
          <span className="black-text">Origins Easter Egg</span>{" "}
          <span className="white-text">Little Lost Girl</span>
        </h1>
        <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-header-icon" />
      </div>
      <Nav />
    </header>
  );
};

export default Header;
