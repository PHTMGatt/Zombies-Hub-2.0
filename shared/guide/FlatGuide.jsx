import React from 'react';
import { Link } from 'react-router-dom';
import './flat-guide.css';
import { stepLinkHref } from './stepLinks';
import useHashFocus from './useHashFocus';

/*
 * The main guide for an Easter Egg: a flat, ordered list. Each step is visible at once and shows only
 *   number · title · one short line (step.goal) · optional small "details →" links into the owning tab.
 * No expand/collapse, chips, images or header bars. Detail lives on the nav tabs; step.links point there.
 * Each <li> keeps id={step.id} so "Back to step N" and #step-id links land on it, and each link keeps
 * data-step-link. Colours come from --flat-* variables so every map can set its own palette.
 */
// Links that share one suffix ("Ice Staff: build", "Fire Staff: build") collapse to "Details: Ice Staff · Fire Staff".
const grouped = (links) => links.length > 1 && links.every((l) => l.label.includes(': '));
const linkText = (link, group) => (group ? link.label.split(': ')[0] : link.label);

export default function FlatGuide({ steps, label, footer, className = '' }) {
  useHashFocus();
  return (
    <div className={`flat-guide ${className}`.trim()}>
      <ol className="flat-guide__list" aria-label={label}>
        {steps.map((step, i) => (
          <li className="flat-guide__step" id={step.id} key={step.id}>
            <span className="flat-guide__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="flat-guide__body">
              <h2 className="flat-guide__title"><span className="flat-guide__sr">Step {i + 1}: </span>{step.title}</h2>
              {step.goal && <p className="flat-guide__line">{step.goal}</p>}
              {step.links?.length > 0 && (
                <p className="flat-guide__links">
                  {grouped(step.links) && <span className="flat-guide__links-label">Details:</span>}
                  {step.links.map((link) => (
                    <Link
                      key={`${link.to}#${link.section ?? ''}`}
                      to={stepLinkHref(link, step.id)}
                      data-step-link={link.section ?? ''}
                      style={link.tone ? { '--flat-tone': link.tone } : undefined}
                    >
                      {linkText(link, grouped(step.links))} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      {footer}
    </div>
  );
}
