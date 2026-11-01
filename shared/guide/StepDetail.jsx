import React from 'react';
import { Link } from 'react-router-dom';
import './guide.css';

/*
 * A step's second depth, from the step data alone: how-to, video, page links and "Not working?".
 * No layout opinion: each map places it where its own structure needs it.
 * `problems` / `links` default to the step's own; a map can pass merged lists (e.g. per selected tab).
 */
export function StepMore({ step, problems = step.problems ?? [], links = step.links ?? [], summary = 'More on this step' }) {
  const hasMore = step.how?.length > 0 || step.video || links.length > 0 || problems.length > 0;
  if (!hasMore) return null;

  return (
    <details className="guide-seq__more">
      <summary>{summary}</summary>
      {step.how?.length > 0 && (
        <section className="guide-how">
          <h4>How to do it</h4>
          <ol>{step.how.map((line) => <li key={line}>{line}</li>)}</ol>
        </section>
      )}
      {step.video && (
        <a className="guide-video" href={step.video.url} target="_blank" rel="noreferrer">
          {step.video.label ?? 'Watch this section'} <span aria-hidden="true">↗</span>
        </a>
      )}
      {links.length > 0 && (
        <div className="guide-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to} style={link.tone ? { '--gref-tone': link.tone } : undefined}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
      {problems.length > 0 && (
        <details className="guide-problems">
          <summary>Not working?</summary>
          <ul>{problems.map((line) => <li key={line}>{line}</li>)}</ul>
        </details>
      )}
    </details>
  );
}

export default StepMore;
