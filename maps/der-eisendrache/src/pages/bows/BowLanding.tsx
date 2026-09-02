import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE = '/maps/der-eisendrache/bows';

const bows = [
  { path: 'base', label: 'Wrath of the Ancients', type: 'Base Bow', meta: 'Required · Easy', accent: 'base' },
  { path: 'electric', label: 'Storm Bow', type: 'Electric Upgrade', meta: 'Fast · Easy', accent: 'electric' },
  { path: 'fire', label: 'Fire Bow', type: 'Fire Upgrade', meta: 'Precision · Hard', accent: 'fire' },
  { path: 'wolf', label: 'Wolf Bow', type: 'Wolf Upgrade', meta: 'Route · Medium', accent: 'wolf' },
  { path: 'void', label: 'Void Bow', type: 'Void Upgrade', meta: 'Puzzle · Medium', accent: 'void' },
];

const BowLanding: React.FC = () => (
  <section className="bow-landing">
    <span className="bow-landing__kicker">Wrath of the Ancients</span>
    <h1>Choose Your Bow</h1>
    <p className="bow-landing__intro">
      Get the base bow first, then open only the elemental upgrade you are actually building.
    </p>
    <p className="bow-landing__rule">
      <strong>Quest rule:</strong> standard solo needs one upgraded bow and normal co-op needs one per player. A non-ranked private game can require all four upgrades regardless of player count.
    </p>

    <div className="bow-choice-grid">
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
            <span className="bow-choice-card__action">Open guide →</span>
          </span>
        </NavLink>
      ))}
    </div>
  </section>
);

export default BowLanding;
