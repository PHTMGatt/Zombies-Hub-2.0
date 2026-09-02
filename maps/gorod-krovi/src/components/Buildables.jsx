import React, { useState } from 'react';
import buildables from '../data/buildables';
import '../styles/Buildables.css';
import StepCard from './StepCard';

const Buildables = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="buildables-page">
      <div className="glass-card buildables-card">
        <h1 className="section-title">🔧 Buildables</h1>
        <p className="section-subtitle">
          Select a craftable item to view its full assembly steps.
        </p>

        <div className="buildables-nav">
          {buildables.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelected(item)}
              className={`buildable-button ${selected === item ? 'active' : ''}`}
              aria-pressed={selected === item}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="buildables-content">
          {selected ? (
            <>
              <h2 className="buildables-title">{selected.name}</h2>
              <div className="buildables-steps">
                {selected.steps.map((step, idx) => (
                  <StepCard key={idx} step={step} />
                ))}
              </div>
            </>
          ) : (
            <p className="buildables-placeholder">
              👆 Select an item above to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buildables;
