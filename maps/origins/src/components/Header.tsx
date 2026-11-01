import React from "react";
import Nav from "./Nav";
import "../Styles/ComponentStyles/Header.css";

// Title block: the map name set large, the Easter Egg beneath, the robot cropped beside it. The
// artwork stays here; the guide below sits on the plain trench ground.
const Header = () => (
  <>
    <header className="origins-mast">
      <div className="origins-mast__title">
        <p className="origins-mast__eyebrow">Main Easter Egg</p>
        <h1>Origins</h1>
        <p className="origins-mast__sub">Little Lost Girl</p>
      </div>
      <div className="origins-mast__art" aria-hidden="true" />
    </header>
    <Nav />
  </>
);

export default Header;
