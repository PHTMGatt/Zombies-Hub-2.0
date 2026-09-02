import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = ({ to = -1, label = '← Back' }) => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(to)}>
      {label}
    </button>
  );
};

export default BackButton;
