import React from 'react';

/*
 * The Excavation finish every staff upgrade shares: four rings, four levers. Turn every ring to the
 * staff's colour, then shoot the matching orb below them with that staff.
 * Deliberately no lever-to-ring labels: that mapping is not independently verified, so it is not shown,
 * and the levers are drawn apart from the rings rather than wired to one each.
 * (Lightning's seven electrical-panel switches are a different system and live on the Lightning page.)
 */
const RINGS = [24, 58, 92, 126];
const LEVERS = [40, 70, 100, 130];

export default function ExcavationRings({ staffName, ring }) {
  const label = `Excavation: four levers and four rings, all rings turned ${ring.word}, with the ${ring.orb} orb below them.`;
  return (
    <figure className="excavation-rings">
      <svg viewBox="0 0 172 176" role="img" aria-label={label}>
        <g className="excavation-rings__levers">
          {LEVERS.map((y) => (
            <g key={y} transform={`translate(12 ${y}) scale(1.5)`}>
              <rect x="-4" y="-2" width="8" height="12" rx="2" />
              <line x1="0" y1="2" x2="8" y2="-10" />
              <circle cx="8" cy="-10" r="3" />
            </g>
          ))}
        </g>
        <g fill="none" strokeWidth="7">
          {RINGS.map((y) => <ellipse key={y} className="excavation-rings__ring" cx="106" cy={y} rx="56" ry="13" />)}
        </g>
        <circle className="excavation-rings__orb" cx="106" cy="160" r="11" />
      </svg>
      <figcaption>
        <strong>Four levers, four rings</strong>
        <span>Use the four levers to turn every ring <b>{ring.word}</b>, then shoot the {ring.orb} orb below them with the {staffName} Staff.</span>
      </figcaption>
    </figure>
  );
}
