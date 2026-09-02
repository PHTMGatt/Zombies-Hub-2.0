import React from 'react';
import PropTypes from 'prop-types';
import '../styles/SideEE/SideEECard.css';

const SideEECard = ({ title, description }) => (
  <article className="side-ee-entry-card">
    <h3 className="side-ee-entry-card__title">{title}</h3>
    <p className="side-ee-entry-card__desc">{description}</p>
  </article>
);

SideEECard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default SideEECard;
