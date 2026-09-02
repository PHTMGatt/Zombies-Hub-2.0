import React from 'react';
import buildables from '../data/buildables';
import StepCard from '../components/StepCard';
import '../styles/Buildables.css';

const Buildables = () => (
  <div className="buildables-page">
    <div className="glass-card buildables-card">
      <h1 className="section-title">Buildables</h1>
      <p className="section-subtitle">
        Select a craftable item to view its assembly steps.
      </p>
      <div className="buildables-grid">
        {buildables.map((item, index) => (
          <StepCard key={index} title={item.name} steps={item.steps} />
        ))}
      </div>
    </div>
  </div>
);

export default Buildables;
