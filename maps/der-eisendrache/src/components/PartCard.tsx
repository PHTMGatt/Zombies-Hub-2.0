// 'PartCard.tsx'
// ----------------

import React from 'react';
import '../styles/components/PartCard.css';

interface PartCardProps {
  title: string;
  steps: string[];
}

const PartCard: React.FC<PartCardProps> = ({ title, steps }) => (
  <div className="part-card">
    <h2 className="part-card__title">{title}</h2>
    <ul className="part-card__list">
      {steps.map((step, i) => (
        <li key={i} className="part-card__item">
          {step}
        </li>
      ))}
    </ul>
  </div>
);

export default PartCard;
