import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { stepOrigin } from './stepLinks';

/*
 * "Back to step N" on a tab page opened from a main-guide step (?from=<step id>). Renders nothing when
 * the page was opened any other way. Presentation (placement, look) belongs to the page; this only
 * decides whether to show and where to go: the main guide, landing on (and opening) that step.
 *   <BackToStep guidePath="/maps/der-eisendrache" steps={deGuideSteps} />
 */
export default function BackToStep({ guidePath, steps, className = 'guide-back-to-step' }) {
  const { search } = useLocation();
  const origin = stepOrigin(search, steps);
  if (!origin) return null;
  return (
    <Link className={className} to={`${guidePath}#${origin.step.id}`} data-back-to-step={origin.step.id}>
      <span aria-hidden="true">←</span> Back to step {origin.number}: {origin.step.title}
    </Link>
  );
}
