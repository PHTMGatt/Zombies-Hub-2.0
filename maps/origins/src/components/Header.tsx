import React from "react";
import ReviveIcon from "../assets/images/Revive_Icon.png";
import Nav from "./Nav";
import "../Styles/ComponentStyles/Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-left">
        <div className="title-box">
          <img src={ReviveIcon} alt="Revive Icon" className="revive-header-icon" />
          <h1 className="header-title">
            <span className="black-text">Origins Easter Egg</span>{" "}
            <span className="white-text">Little Lost Girl</span>
          </h1>
          <img src={ReviveIcon} alt="Revive Icon" className="revive-header-icon" />
        </div>
      </div>
      <div className="header-right">
        <Nav />
      </div>
    </header>
  );
};

export default Header;
