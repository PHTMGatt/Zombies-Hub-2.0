import React from 'react';
import NavBar from './NavBar';
import '../styles/components/Header.css';

const Header: React.FC = () => (
  <header className="de-header">
    <div className="de-header__art" aria-hidden="true" />
    <div className="de-header__veil" aria-hidden="true" />
    <div className="de-header__content">
      <div className="de-header__identity">
        <span className="de-header__eyebrow">Black Ops III Zombies</span>
        <div className="de-header__title-row">
          <h1>Der Eisendrache</h1>
          <span>My Brother’s Keeper</span>
        </div>
      </div>
      <NavBar />
    </div>
  </header>
);

export default Header;
