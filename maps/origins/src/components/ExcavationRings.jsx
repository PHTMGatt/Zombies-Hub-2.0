import React from 'react';

/*
 * The Excavation finish every staff upgrade shares: the same four rings and four levers. Turn every ring
 * to the staff's colour, then shoot the matching orb below them with that staff.
 * Deliberately no lever-to-ring labels: that mapping is not independently verified, so it is not shown.
 * (Lightning's seven electrical-panel switches are a different system and live on the Lightning page.)
 */
const RINGS = [24, 58, 92, 126];

export default function ExcavationRings({ staffName, ring }) {
  const label = `Excavation: four rings, all turned ${ring.word}, with the ${ring.orb} orb below them.`;
  return (
    <figure className="excavation-rings">
      <svg viewBox="0 0 132 176" role="img" aria-label={label}>
        <g fill="none" strokeWidth="7">
          {RINGS.map((y) => <ellipse key={y} className="excavation-rings__ring" cx="66" cy={y} rx="56" ry="13" />)}
        </g>
        <circle className="excavation-rings__orb" cx="66" cy="160" r="11" />
      </svg>
      <figcaption>
        <strong>Four rings, four levers</strong>
        <span>Turn every ring <b>{ring.word}</b>, then shoot the {ring.orb} orb below them with the {staffName} Staff.</span>
      </figcaption>
    </figure>
  );
}
