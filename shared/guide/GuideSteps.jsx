import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GuideReferences from './GuideReferences';
import './guide.css';

/*
 * An Easter Egg as one plain sequence: every step visible, in order, each addressable as #<step.id>.
 *   Always shown: title, goal, warnings, references, and task facts (as text, never checkboxes).
 *   Behind "More": how-to, video, page links, and "Not working?" troubleshooting.
 * No modes, no progress, no stored state. This is the neutral presentation each map keeps until its
 * own redesign gives it a layout built around its mechanics.
 *
 * Step shape: { id, title, goal, refs, tasks: [{ id, label, hint? }], how, problems, critical, video, links }.
 * A tabs ref's tabs may add their own `problems` and `links`, shown only while that tab is selected.
 */
function StepItem({ step }) {
  const [variant, setVariant] = useState(null);
  const tabsRef = step.refs?.find((ref) => ref.type === 'tabs');
  const activeTab = tabsRef ? (tabsRef.tabs.find((tab) => tab.id === variant) ?? tabsRef.tabs[0]) : null;
  const problems = [...(step.problems ?? []), ...(activeTab?.problems ?? [])];
  const links = [...(activeTab?.links ?? []), ...(step.links ?? [])];
  const hasMore = step.how?.length > 0 || step.video || links.length > 0 || problems.length > 0;

  return (
    <li className="guide-seq__step" id={step.id}>
      <h3>{step.title}</h3>
      {step.goal && <p className="guide-seq__goal">{step.goal}</p>}
      {step.critical?.map((text) => <p key={text} className="gref gref--warning" role="note"><strong>Watch out</strong> {text}</p>)}

      <GuideReferences refs={step.refs} tabState={{ value: variant, set: setVariant }} />

      {step.tasks?.length > 0 && (
        <ul className="guide-seq__tasks">
          {step.tasks.map((task) => (
            <li key={task.id} style={task.tone ? { '--gref-tone': task.tone } : undefined}>
              {task.label}
              {task.hint && <small>{task.hint}</small>}
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <details className="guide-seq__more">
          <summary>More on this step</summary>
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
      )}
    </li>
  );
}

// A mistyped or truncated link (#100%) must never take the guide down.
const fragmentId = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};

// Bottom edge of whatever is pinned over the page: the hub bar and, on some maps, the map header too.
const pinnedBottom = () => Math.max(0, ...[...document.querySelectorAll('.hub-header, .map-module header')]
  .filter((element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position))
  .map((element) => element.getBoundingClientRect().bottom));

export default function GuideSteps({ label, steps, footer }) {
  const { hash, search } = useLocation();

  // The map chunk loads after the app shell has already tried to scroll to #<step>; finish the job here.
  // Wait for web fonts (a late font swap moves the step after the scroll), then jump without animating,
  // and nudge the step clear of a pinned map header. An old ?ref=<step> link counts too: the app shell
  // rewrites it to #<step>, but this may render first.
  useEffect(() => {
    const id = fragmentId(hash) || new URLSearchParams(search).get('ref');
    if (!id || !steps.some((step) => step.id === id)) return undefined;
    let cancelled = false;
    const land = () => {
      const target = document.getElementById(id);
      if (cancelled || !target) return;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      const overlap = pinnedBottom() + 12 - target.getBoundingClientRect().top;
      if (overlap > 0) window.scrollBy({ top: -overlap, behavior: 'instant' });
    };
    land();
    (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(land));
    return () => { cancelled = true; };
  }, [hash, search, steps]);

  return (
    <section className="guide" aria-label={`${label} guide`}>
      <ol className="guide-seq">
        {steps.map((step) => <StepItem key={step.id} step={step} />)}
      </ol>
      {footer && <div className="guide-seq__footer">{footer}</div>}
    </section>
  );
}
