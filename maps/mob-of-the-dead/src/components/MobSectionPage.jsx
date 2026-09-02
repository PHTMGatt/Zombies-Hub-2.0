import React from 'react';
import '../styles/MobSections.css';

export default function MobSectionPage({
  kicker,
  title,
  description,
  chips = [],
  note,
  steps,
}) {
  return (
    <main className="mob-section-page">
      <header className="mob-sheet-header">
        {kicker && <span>{kicker}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {chips.length > 0 && (
          <div className="mob-sheet-chips">
            {chips.map((chip) => <small key={chip}>{chip}</small>)}
          </div>
        )}
      </header>

      {note && (
        <aside className="mob-sheet-note">
          <strong>{note.label}</strong>
          <span>{note.body}</span>
        </aside>
      )}

      <div className="mob-sheet">
        {steps.map((step, index) => (
          <section className="mob-sheet-step" key={step.title}>
            <div className="mob-sheet-step__heading">
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
            </div>
            <p>{step.summary}</p>
            {step.details?.length > 0 && (
              <ul>
                {step.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
