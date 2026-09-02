import React, { useState } from 'react';
import Nav from './Nav';
import '../styles/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="zets-header">
      <div className="zets-header-content">
        <div className="zets-header-identity">
          <h1 className="zets-header-title">Zetsubou No Shima</h1>
          <p className="zets-header-subtitle">Seeds of Doubt</p>
        </div>

        <button
          type="button"
          className="zets-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle Zetsubou guide navigation"
        >
          <span aria-hidden="true">☰</span>
          <span className="toggle-label">{menuOpen ? 'Close' : 'Guide Menu'}</span>
        </button>
      </div>

      <Nav isOpen={menuOpen} />
    </header>
  );
};

export default Header;
