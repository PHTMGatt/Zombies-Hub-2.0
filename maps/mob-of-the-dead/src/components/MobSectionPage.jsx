import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
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
      <GuideHero kicker={kicker} title={title} description={description}>
        {chips.map((chip) => <GuideChip key={chip}>{chip}</GuideChip>)}
      </GuideHero>

      {note && (
        <GuideCallout label={note.label} tone="info" className="mob-section-note">
          {note.body}
        </GuideCallout>
      )}

      <GuideSection kicker="Quick Reference" title="Run it in order">
        <GuideStepList>
          {steps.map((step, index) => (
            <GuideStepCard
              key={step.title}
              step={index + 1}
              label={step.label || 'Objective'}
              title={step.title}
              summary={step.summary}
            >
              {step.details?.length > 0 && (
                <ul className="mob-section-details">
                  {step.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              )}
            </GuideStepCard>
          ))}
        </GuideStepList>
      </GuideSection>
    </main>
  );
}
