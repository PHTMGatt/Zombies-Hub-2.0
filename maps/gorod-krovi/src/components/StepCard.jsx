// src/components/StepCard.jsx
import React from 'react';
import '../styles/Buildables.css';

const StepCard = ({ title, steps }) => {
  // Strip out any “Piece N:” prefix and trailing period
  const cleanSteps = steps.map(step =>
    step.replace(/^Piece\s*\d+:\s*/i, '').replace(/\.$/, '')
  );

  return (
    <article className="step-card" role="group" aria-label={title}>
      <h2 className="step-title">{title}</h2>
      <ul className="step-list">
        {cleanSteps.map((step, idx) => (
          <li key={idx} className="step-text">
            {step}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default StepCard;
