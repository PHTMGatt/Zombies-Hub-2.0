import React, { useState } from 'react';
import GuideReferences from './GuideReferences';
import { StepMore } from './StepDetail';
import useHashLanding from './useHashLanding';
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
export function StepItem({ step }) {
  const [variant, setVariant] = useState(null);
  const tabsRef = step.refs?.find((ref) => ref.type === 'tabs');
  const activeTab = tabsRef ? (tabsRef.tabs.find((tab) => tab.id === variant) ?? tabsRef.tabs[0]) : null;
  const problems = [...(step.problems ?? []), ...(activeTab?.problems ?? [])];
  const links = [...(activeTab?.links ?? []), ...(step.links ?? [])];

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

      <StepMore step={step} problems={problems} links={links} />
    </li>
  );
}

export default function GuideSteps({ label, steps, footer }) {
  useHashLanding(steps.map((step) => step.id));

  return (
    <section className="guide" aria-label={`${label} guide`}>
      <ol className="guide-seq">
        {steps.map((step) => <StepItem key={step.id} step={step} />)}
      </ol>
      {footer && <div className="guide-seq__footer">{footer}</div>}
    </section>
  );
}
