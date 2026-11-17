import React from 'react';

/*
 * The Excavation finish every staff upgrade shares: four rings, four levers. Turn every ring to the
 * staff's colour, then shoot the matching orb below them with that staff.
 * Text only (2026-11-16): the drawing taught nothing the sentence does not, so it is gone.
 * (Lightning's seven electrical-panel switches are a different system and live on the Lightning page.)
 */
export default function ExcavationRings({ staffName, ring }) {
  return (
    <div className="excavation-rings">
      <p>
        <strong>Four levers, four rings. </strong>
        Use the four levers to turn every ring <b>{ring.word}</b>, then shoot the {ring.orb} orb below them with the {staffName} Staff.
      </p>
    </div>
  );
}
