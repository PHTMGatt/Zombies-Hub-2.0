import React from "react";
import ReviveIcon from "../assets/images/Revive_Icon.png";
import Nav from "./Nav";
import "../Styles/ComponentStyles/Header.css";

/*
 * The OG Origins band: icy blue over the snowy robot, Revive icons either side of the title, and the
 * guide's five tabs on their own row beneath. On wide screens the band pins with only the tab row
 * showing (the title row slides away under the hub bar); phones let it scroll.
 */
const Header = () => (
  <div className="origins-top" data-pinned>
    <header className="origins-head">
      <img src={ReviveIcon} alt="" className="origins-head__revive" />
      <h1 className="origins-head__title">
        <span className="origins-head__map">Origins Easter Egg</span>{" "}
        <span className="origins-head__ee">Little Lost Girl</span>
      </h1>
      <img src={ReviveIcon} alt="" className="origins-head__revive" />
    </header>
    <Nav />
  </div>
);

export default Header;
