import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE = '/maps/der-eisendrache/bows';

const bows = [
  { path: 'base', label: 'Wrath of the Ancients', type: 'Base', meta: 'Required', accent: 'base' },
  { path: 'electric', label: 'Storm Bow', type: 'Electric', meta: 'Fast · Easy', accent: 'electric' },
  { path: 'fire', label: 'Fire Bow', type: 'Fire', meta: 'Precision', accent: 'fire' },
  { path: 'wolf', label: 'Wolf Bow', type: 'Wolf', meta: 'Route', accent: 'wolf' },
  { path: 'void', label: 'Void Bow', type: 'Void', meta: 'Puzzle', accent: 'void' },
];

const BowLanding: React.FC = () => (
  <section className="bow-landing">
    <div className="bow-landing__heading">
      <div>
        <span className="bow-landing__kicker">Wrath of the Ancients</span>
        <h1>Choose Your Bow</h1>
      </div>
      <p>Get the base bow, then open only the upgrade you are building.</p>
    </div>

    <div className="bow-choice-grid" aria-label="Der Eisendrache bow guides">
      {bows.map((bow) => (
        <NavLink
          key={bow.path}
          to={`${BASE}/${bow.path}`}
          className={`bow-choice-card bow-choice-card--${bow.accent}`}
        >
          <span className="bow-choice-card__sigil" aria-hidden="true"><span /></span>
          <span className="bow-choice-card__copy">
            <span className="bow-choice-card__label">{bow.type}</span>
            <strong>{bow.label}</strong>
            <span className="bow-choice-card__meta">{bow.meta}</span>
          </span>
        </NavLink>
      ))}
    </div>

    <p className="bow-landing__rule">
      <strong>Quest rule:</strong> standard solo needs one upgraded bow; normal co-op needs one per player. Non-ranked private games can require all four.
    </p>
  </section>
);

export default BowLanding;
