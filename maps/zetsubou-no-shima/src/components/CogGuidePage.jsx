import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';

const BASE = '/maps/zetsubou-no-shima';

export default function CogGuidePage({
  number,
  title,
  description,
  chips = [],
  note,
  steps,
}) {
  return (
    <main className="zets-detail-page zets-cog-detail-page">
      <GuideHero kicker={`Zetsubou No Shima · Cog ${number}`} title={title} description={description}>
        {chips.map((chip) => <GuideChip key={chip}>{chip}</GuideChip>)}
      </GuideHero>

      {note && (
        <GuideCallout label={note.label} tone="info" className="zets-detail-note">
          {note.body}
        </GuideCallout>
      )}

      <GuideSection kicker={`Cog ${number}`} title="Do it in order">
        <GuideStepList>
          {steps.map((step, index) => (
            <GuideStepCard
              key={step.title}
              step={index + 1}
              label={step.label || 'Cog Objective'}
              title={step.title}
              summary={step.summary}
            >
              {step.details?.length > 0 && (
                <ul className="zets-run-details">
                  {step.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              )}
            </GuideStepCard>
          ))}
        </GuideStepList>
      </GuideSection>

      <div className="zets-back-row">
        <Link to={`${BASE}/cogs`}>← Back to all three cogs</Link>
      </div>
    </main>
  );
}
