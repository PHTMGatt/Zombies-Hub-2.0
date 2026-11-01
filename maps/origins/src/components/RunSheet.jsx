import React from 'react';
import GuideReferences from '../../../../shared/guide/GuideReferences';
import { StepMore } from '../../../../shared/guide/StepDetail';
import useHashLanding from '../../../../shared/guide/useHashLanding';
import StaffBoard from './StaffBoard';

/*
 * Little Lost Girl as a field sheet: every step on one brass survey spine, its answer first and at
 * reading size, its small references inline, its how-to behind one disclosure. The staff steps
 * (1 and 2) hand their four-way detail to the staff board instead of tabs.
 */
const MORE_LABEL = { 'build-staffs': 'How to build', 'upgrade-staffs': 'How to upgrade' };

function RunStep({ step, number }) {
  const staffStep = step.id === 'build-staffs' || step.id === 'upgrade-staffs';
  const buildFacts = step.id === 'build-staffs' ? step.refs.filter((ref) => ref.type === 'facts').flatMap((ref) => ref.items) : [];

  return (
    <li className={`run-step${staffStep ? ' run-step--staff' : ''}`} id={step.id}>
      <span className="run-step__n" aria-hidden="true">{number}</span>
      <h3>{step.title}</h3>
      <p className="run-step__answer">{step.goal}</p>
      {step.critical?.map((text) => (
        <p key={text} className="run-step__warn" role="note"><strong>Watch out</strong> {text}</p>
      ))}

      {step.id === 'build-staffs' && (
        <>
          <p className="run-step__aside only-wide">Every part, record and crystal is on the staff board.</p>
          <StaffBoard step={step} mode="build" layout="rows" className="only-narrow" />
          {buildFacts.map((item) => <p key={item.k} className="run-step__fact only-narrow"><b>{item.k}</b> {item.v}</p>)}
        </>
      )}
      {step.id === 'upgrade-staffs' && (
        <>
          <StaffBoard step={step} mode="upgrade" layout="columns" className="only-wide" />
          <StaffBoard step={step} mode="upgrade" layout="rows" className="only-narrow" />
        </>
      )}
      {!staffStep && <GuideReferences refs={step.refs} />}

      <StepMore step={step} summary={MORE_LABEL[step.id] ?? 'More'} />
    </li>
  );
}

export default function RunSheet({ steps, footer }) {
  useHashLanding(steps.map((step) => step.id));
  const buildStep = steps.find((step) => step.id === 'build-staffs');

  return (
    <div className="origins-sheet">
      <section className="run-sheet" aria-labelledby="run-sheet-title">
        <h2 id="run-sheet-title" className="visually-hidden">Little Lost Girl</h2>
        <ol className="run-sheet__steps">
          {steps.map((step, index) => <RunStep key={step.id} step={step} number={index + 1} />)}
        </ol>
        {footer && <div className="run-sheet__footer">{footer}</div>}
      </section>
      {buildStep && <StaffBoard step={buildStep} mode="build" layout="board" className="only-wide" />}
    </div>
  );
}
