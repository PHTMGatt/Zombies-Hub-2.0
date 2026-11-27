import React from 'react';
import ReviveIcon from '../assets/images/Revive_Icon.png';
import '../Styles/PageStyles/OGStaff.css';

// One section card of the original staff pages: heading with the Revive icon, an optional list, an optional chart.
function Section({ section }) {
  return (
    <section className="staff-section">
      <h2>
        <img src={ReviveIcon} alt="" aria-hidden="true" className="revive-icon" /> {section.title}
      </h2>
      {section.items && (
        <ul>
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      {section.chart && (
        <img src={section.chart.src} alt={section.chart.alt} className="og-staff__chart" width={section.chart.width} height={section.chart.height} />
      )}
    </section>
  );
}

// The original staff page layout: two cards on the left (parts, then the puzzle with its chart), notes on the right.
export default function OGStaffPage({ staff, left, right, aside }) {
  return (
    <div className={`og-staff og-staff--${staff}`}>
      <div className="staff-grid">
        <div className="left-column">
          {left.map((section) => <Section key={section.title} section={section} />)}
        </div>
        <div className="right-column">
          {right.map((section) => <Section key={section.title} section={section} />)}
          {aside}
        </div>
      </div>
    </div>
  );
}
