// src/components/TriviaHover.jsx
import React, { useState } from 'react';

const TriviaHover = ({ title, details }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="trivia-hover"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(v => !v)}
    >
      <span className="trivia-title">{title}</span>
      {visible && (
        <div className="trivia-details">
          {details}
        </div>
      )}
    </div>
  );
};

export default TriviaHover;
