import React from 'react';

// Shared section heading so the main guide and every reference page read as one product.
function RevSectionHeader({ kicker, title, intro }) {
  return (
    <header className="rev-section-head">
      <div>
        <span className="rev-kicker">{kicker}</span>
        <h2 className="rev-section-title">{title}</h2>
      </div>
      {intro && <p className="rev-section-intro">{intro}</p>}
    </header>
  );
}

export default RevSectionHeader;
