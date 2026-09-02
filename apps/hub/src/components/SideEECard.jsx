// File: SideEECard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import '../styles/SideEE/SideEECard.css';

const SideEECard = ({ title, description }) => (
  <div className="side-ee-card">
    <h3 className="side-ee-card__title">{title}</h3>
    <p className="side-ee-card__desc">{description}</p>
  </div>
);

// Prop validation
SideEECard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default SideEECard;
