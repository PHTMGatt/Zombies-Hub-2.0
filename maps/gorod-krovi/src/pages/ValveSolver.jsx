import React, { useState } from 'react';
import valveSolutions from '../data/valveSolutions';
import GKMap from '../assets/GK_Map.png';
import '../styles/ValveSolver.css';

const ValveSolver = () => {
  const [greenValve, setGreenValve] = useState('');
  const [cylinderLocation, setCylinderLocation] = useState('');
  const [solution, setSolution] = useState(null);

  const locations = [
    'Dragon Command',
    'Infirmary',
    'Armory',
    'Department Store',
    'Supply Depot',
    'Tank Station',
  ];

  const handleSolve = () => {
    const match = valveSolutions.find(
      (entry) =>
        entry.start === greenValve && entry.end === cylinderLocation
    );
    setSolution(match || null);
  };

  return (
    <div className="valve-solver-page">
      <div className="glass-card valve-solver-card">
        <h1 className="section-title">Valve Solver</h1>
        <p className="section-intro">
          Identify the valve holding the Master Code Cylinder (green) and its location to get the correct settings for all six valves.
        </p>

        <img
          src={GKMap}
          alt="Gorod Krovi valve locations"
          className="valve-map"
        />

        <div className="valve-selectors">
          <label>
            Master Cylinder Valve:
            <select
              value={greenValve}
              onChange={(e) => {
                setGreenValve(e.target.value);
                setSolution(null);
              }}
            >
              <option value="">Select one</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cylinder At Valve:
            <select
              value={cylinderLocation}
              onChange={(e) => {
                setCylinderLocation(e.target.value);
                setSolution(null);
              }}
            >
              <option value="">Select one</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={handleSolve}
            disabled={!greenValve || !cylinderLocation}
          >
            Solve
          </button>
        </div>

        {solution && (
          <div className="valve-solution">
            {solution.message ? (
              <p>{solution.message}</p>
            ) : (
              Object.entries(solution.valves).map(([location, setting]) => (
                <p key={location}>
                  Set <strong>{location}</strong> to <strong>{setting}</strong>
                </p>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValveSolver;
