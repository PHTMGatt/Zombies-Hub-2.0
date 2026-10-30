import React from 'react';
import ValveSolverTool from '../components/ValveSolverTool';
import GKMap from '../assets/GK_Map.webp';
import {
  GuideHero,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import '../styles/ValveSolver.css';

const ValveSolver = () => {
  return (
    <div className="gorod-valve-page">
      <GuideHero
        kicker="Gorod Krovi"
        title="Valve Solver"
        description="Choose where the green light starts and where the Master Code Cylinder is located. The solver returns the five valve settings for that game."
      >
        <GuideChip>Randomized puzzle</GuideChip>
        <GuideChip>5 settings</GuideChip>
        <GuideChip>S.O.P.H.I.A. setup</GuideChip>
      </GuideHero>

      <GuideCallout label="What to look for" tone="info" className="gorod-valve-note">
        Find the valve with the green light, then find the air-vent location holding the Master Code Cylinder. Those two locations are the only inputs the solver needs.
      </GuideCallout>

      <section className="gorod-valve-workspace">
        <div className="gorod-valve-map-wrap">
          <img
            src={GKMap}
            alt="Gorod Krovi map with the six valve locations marked"
            width="1600"
            height="1040"
            className="gorod-valve-map"
          />
        </div>

        <ValveSolverTool />
      </section>
    </div>
  );
};

export default ValveSolver;
