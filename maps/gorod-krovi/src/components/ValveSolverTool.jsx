import React, { useMemo, useState } from 'react';
import valveSolutions from '../data/valveSolutions';
import '../styles/ValveSolver.css';

export const VALVE_LOCATIONS = [
  'Dragon Command',
  'Infirmary',
  'Armory',
  'Department Store',
  'Supply Depot',
  'Tank Factory',
];

// Where each valve sits, as labelled on the valve map legend (GK_Map.webp).
export const VALVE_HINTS = {
  'Dragon Command': 'Up stairs, turn right, opposite S.O.P.H.I.A.',
  Infirmary: 'Middle level, next to the bunk bed',
  Armory: 'Top floor, opposite the 500-point bridge',
  'Department Store': 'Top floor, next to the staircase',
  'Supply Depot': 'Ground floor, under the balcony',
  'Tank Factory': 'Ground floor, opposite the metal walkways',
};

/*
 * The valve solver itself: pick where the green light starts and where the Master Code Cylinder is,
 * get the five valve settings (the cylinder's own valve is left alone). Used by the Valve Solver page and embedded in the guide's valve step.
 */
export default function ValveSolverTool({ compact = false }) {
  const [greenValve, setGreenValve] = useState('');
  const [cylinderLocation, setCylinderLocation] = useState('');

  const solution = useMemo(() => {
    if (!greenValve || !cylinderLocation) return null;
    return valveSolutions.find((entry) => entry.start === greenValve && entry.end === cylinderLocation) || null;
  }, [greenValve, cylinderLocation]);

  const reset = () => {
    setGreenValve('');
    setCylinderLocation('');
  };

  return (
    <div className={`gorod-valve-tool${compact ? ' is-compact' : ''}`}>
      <div className="gorod-valve-controls">
        <div className="gorod-valve-fields">
          <label>
            <span>Green light starts at</span>
            <select
              value={greenValve}
              onChange={(e) => {
                setGreenValve(e.target.value);
                if (e.target.value === cylinderLocation) setCylinderLocation('');
              }}
            >
              <option value="">Choose location</option>
              {VALVE_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </label>

          <label>
            <span>Master Cylinder is at</span>
            <select value={cylinderLocation} onChange={(e) => setCylinderLocation(e.target.value)}>
              <option value="">Choose location</option>
              {/* The cylinder is never behind the green-lit valve, so that pair has no solution. */}
              {VALVE_LOCATIONS.map((loc) => <option key={loc} value={loc} disabled={loc === greenValve}>{loc}</option>)}
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
          <span>Your five valve settings appear here.</span>
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
                  <span className="gorod-valve-setting__location">
                    {location}
                    {VALVE_HINTS[location] && <small>{VALVE_HINTS[location]}</small>}
                  </span>
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
    </div>
  );
}
