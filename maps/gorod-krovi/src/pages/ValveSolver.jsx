import React, { useMemo, useState } from 'react';
import valveSolutions from '../data/valveSolutions';
import GKMap from '../assets/GK_Map.png';
import {
  GuideHero,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import '../styles/ValveSolver.css';

const locations = [
  'Dragon Command',
  'Infirmary',
  'Armory',
  'Department Store',
  'Supply Depot',
  'Tank Station',
];

const ValveSolver = () => {
  const [greenValve, setGreenValve] = useState('');
  const [cylinderLocation, setCylinderLocation] = useState('');

  const solution = useMemo(() => {
    if (!greenValve || !cylinderLocation) return null;

    return valveSolutions.find(
      (entry) => entry.start === greenValve && entry.end === cylinderLocation
    ) || null;
  }, [greenValve, cylinderLocation]);

  const reset = () => {
    setGreenValve('');
    setCylinderLocation('');
  };

  return (
    <main className="gorod-valve-page">
      <GuideHero
        kicker="Gorod Krovi"
        title="Valve Solver"
        description="Choose where the green light starts and where the Master Code Cylinder is located. The solver returns the six valve settings for that game."
      >
        <GuideChip>Randomized puzzle</GuideChip>
        <GuideChip>6 valves</GuideChip>
        <GuideChip>S.O.P.H.I.A. setup</GuideChip>
      </GuideHero>

      <GuideCallout label="What to look for" tone="info" className="gorod-valve-note">
        Find the valve with the green light, then find the air-vent location holding the Master Code Cylinder. Those two locations are the only inputs the solver needs.
      </GuideCallout>

      <section className="gorod-valve-workspace">
        <div className="gorod-valve-map-wrap">
          <img
            src={GKMap}
            alt="Gorod Krovi map showing valve areas"
            className="gorod-valve-map"
          />
        </div>

        <div className="gorod-valve-controls">
          <div className="gorod-valve-fields">
            <label>
              <span>Green light starts at</span>
              <select value={greenValve} onChange={(e) => setGreenValve(e.target.value)}>
                <option value="">Choose location</option>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </label>

            <label>
              <span>Master Cylinder is at</span>
              <select value={cylinderLocation} onChange={(e) => setCylinderLocation(e.target.value)}>
                <option value="">Choose location</option>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </label>
          </div>

          {(greenValve || cylinderLocation) && (
            <button type="button" className="gorod-valve-reset" onClick={reset}>Reset</button>
          )}
        </div>

        {!greenValve || !cylinderLocation ? (
          <div className="gorod-valve-empty">
            <strong>Select both locations.</strong>
            <span>Your six settings will appear here immediately.</span>
          </div>
        ) : solution ? (
          <div className="gorod-valve-solution" aria-live="polite">
            <div className="gorod-valve-solution__header">
              <span>Solution</span>
              <strong>{greenValve} → {cylinderLocation}</strong>
            </div>

            {solution.message ? (
              <p className="gorod-valve-message">{solution.message}</p>
            ) : (
              <div className="gorod-valve-setting-grid">
                {Object.entries(solution.valves).map(([location, setting], index) => (
                  <div className="gorod-valve-setting" key={location}>
                    <span className="gorod-valve-setting__number">{index + 1}</span>
                    <span className="gorod-valve-setting__location">{location}</span>
                    <strong>{setting}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="gorod-valve-empty is-error" aria-live="polite">
            <strong>No stored solution for that combination.</strong>
            <span>Double-check the two locations before changing valves in-game.</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default ValveSolver;
