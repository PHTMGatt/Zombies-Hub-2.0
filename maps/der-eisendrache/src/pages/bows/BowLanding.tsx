import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE = '/maps/der-eisendrache/bows';

const bows = [
  { path: 'base', label: 'Base Bow', accent: 'base' },
  { path: 'electric', label: 'Electric Bow', accent: 'electric' },
  { path: 'fire', label: 'Fire Bow', accent: 'fire' },
  { path: 'wolf', label: 'Wolf Bow', accent: 'wolf' },
  { path: 'void', label: 'Void Bow', accent: 'void' },
];

const BowLanding: React.FC = () => (
  <section className="bow-landing">
    <span className="bow-landing__kicker">Wrath of the Ancients</span>
    <h1>Choose Your Bow</h1>
    <p className="bow-landing__intro">
      Pick the bow you are building. Each path opens its dedicated upgrade guide without mixing the other bow steps into the page.
    </p>

    <div className="bow-choice-grid">
      {bows.map((bow) => (
        <NavLink
          key={bow.path}
          to={`${BASE}/${bow.path}`}
          className={`bow-choice-card bow-choice-card--${bow.accent}`}
        >
          <span className="bow-choice-card__sigil" aria-hidden="true">
            <span />
          </span>
          <span className="bow-choice-card__copy">
            <span className="bow-choice-card__label">Upgrade Path</span>
            <strong>{bow.label}</strong>
            <span className="bow-choice-card__action">Open guide →</span>
          </span>
        </NavLink>
      ))}
    </div>
  </section>
);

export default BowLanding;
