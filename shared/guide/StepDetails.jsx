import React from 'react';
import { Link } from 'react-router-dom';
import './step-details.css';

/*
 * "Step details" tab: plain text, one anchored section per Easter Egg step (#step-1, #step-2 …), no media.
 * Holds what the flat main guide leaves out: warnings, how-to lines, troubleshooting and short reference lists.
 * Reads the same step objects as FlatGuide: { id, title, goal, critical, how, problems, refs, video }.
 * Ref types shown: facts, chips, sequence, list, warning, tabs (each tab as a labelled block with its own
 * lines and links) and custom (per-game state widgets such as the symbol-order or safe-code note).
 * Props: steps, guidePath (the main guide route, for "Back to the guide"), title.
 */
export const stepAnchor = (index) => `step-${index + 1}`;

const Lines = ({ items }) => (
  <ul>{items.map((it, i) => (typeof it === 'string' ? <li key={`${i}-${it}`}>{it}</li> : <li key={`${i}-${it.k}`}><strong>{it.k}:</strong> {it.v}</li>))}</ul>
);

function RefText({ ref_ }) {
  const items = ref_.items ?? [];
  // 'custom' refs hold per-game state: rendered as-is, as on the old main guide.
  if (ref_.type === 'custom') return ref_.render ? <div className="step-details__ref">{ref_.render()}</div> : null;
  if (ref_.type === 'warning') return ref_.text ? <p className="step-details__warn"><strong>Watch out:</strong> {ref_.text}</p> : null;
  if (ref_.type === 'tabs') {
    return (ref_.tabs ?? []).map((tab) => (
      <div className="step-details__ref" key={tab.id}>
        <h4>{ref_.label ? `${ref_.label}: ` : ''}{tab.label}</h4>
        {tab.refs?.map((r, k) => <RefText ref_={r} key={k} />)}
        {tab.problems?.length > 0 && <Lines items={tab.problems} />}
        {tab.links?.length > 0 && <p>{tab.links.map((l) => <Link key={l.to} to={l.to}>{l.label} →</Link>)}</p>}
      </div>
    ));
  }
  if (!items.length || !['facts', 'chips', 'sequence', 'list'].includes(ref_.type)) return null;
  return (
    <div className="step-details__ref">
      {ref_.label && <h4>{ref_.label}</h4>}
      {ref_.type === 'sequence' ? <ol>{items.map((t, i) => <li key={`${i}-${t}`}>{t}</li>)}</ol> : <Lines items={items} />}
    </div>
  );
}

export default function StepDetails({ steps, guidePath, title = 'Step details' }) {
  return (
    <div className="step-details">
      <h2 className="step-details__title">{title}</h2>
      {steps.map((step, i) => (
        <section className="step-details__step" id={stepAnchor(i)} data-step={step.id} key={step.id} aria-labelledby={`${stepAnchor(i)}-h`}>
          <h3 id={`${stepAnchor(i)}-h`}><span className="step-details__num">{String(i + 1).padStart(2, '0')}</span>{step.title}</h3>
          {step.goal && <p className="step-details__goal">{step.goal}</p>}
          {step.critical?.map((t) => <p className="step-details__warn" key={t}><strong>Watch out:</strong> {t}</p>)}
          {step.how?.length > 0 && <ol className="step-details__how">{step.how.map((t, k) => <li key={`${k}-${t}`}>{t}</li>)}</ol>}
          {step.refs?.map((r, k) => <RefText ref_={r} key={k} />)}
          {step.problems?.length > 0 && (
            <div className="step-details__ref"><h4>Not working?</h4><ul>{step.problems.map((t, k) => <li key={`${k}-${t}`}>{t}</li>)}</ul></div>
          )}
          {step.video?.url && (
            <p className="step-details__video"><a href={step.video.url} target="_blank" rel="noreferrer">{step.video.label} ↗</a></p>
          )}
          {guidePath && <p className="step-details__back"><Link to={`${guidePath}#${step.id}`}>← Back to step {i + 1}</Link></p>}
        </section>
      ))}
    </div>
  );
}
