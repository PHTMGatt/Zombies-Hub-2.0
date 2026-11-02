import React from 'react';
import ZoomImage from '../../../../shared/ui/ZoomImage';
import useHashLanding from '../../../../shared/guide/useHashLanding';
import ExcavationRings from './ExcavationRings';
import SkullIcon from '../assets/images/Skull2.png';
import '../Styles/PageStyles/StaffPage.css';

/*
 * One Origins staff, OG layout cleaned up: Build and Puzzle in the wide left column, Upgrade beside them
 * (held in view on tall desktop screens). Phones read Build → Puzzle → Upgrade in one column.
 * Every line comes from originsStaffPages.js.
 */
const Step = ({ item }) => (typeof item === 'string'
  ? <li>{item}</li>
  : <li><strong>{`${item.label}:`}</strong> {item.text}</li>);

const PanelTitle = ({ id, children }) => (
  <h3 id={id}><img src={SkullIcon} alt="" className="origins-panel__icon" /> {children}</h3>
);

export default function StaffPage({ staff, tools = null, extra = null }) {
  const { id, name, build, puzzle, upgrade, ring } = staff;
  // Section links (#build, #puzzle, #upgrade, Lightning's #switches) land clear of the pinned tab row.
  useHashLanding(['build', 'puzzle', 'upgrade', 'switches']);

  return (
    <div className={`origins-page staff-page${tools ? ' staff-page--tools' : ''}`} data-staff={id}>
      <h2 className="visually-hidden">{name} Staff</h2>
      <nav className="staff-page__jump" aria-label={`${name} Staff sections`}>
        <a href="#build">Build</a>
        <a href="#puzzle">Puzzle</a>
        <a href="#upgrade">Upgrade</a>
      </nav>

      <div className="staff-page__main">
        <section className="origins-panel staff-block" id="build" aria-labelledby="build-title">
          <PanelTitle id="build-title">Build</PanelTitle>
          <dl className="staff-page__facts">
            {build.map((row) => (
              <div key={row.k}>
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="origins-panel staff-block" id="puzzle" aria-labelledby="puzzle-title">
          <PanelTitle id="puzzle-title">Puzzle</PanelTitle>
          {puzzle.pianoCode && (
            <div className="staff-page__chords" role="group" aria-label={`Piano code: ${puzzle.pianoCode.join(', ')}`}>
              <span className="staff-page__label">Piano code</span>
              <ol>{puzzle.pianoCode.map((chord) => <li key={chord}>{chord}</li>)}</ol>
            </div>
          )}
          {/* A single step is not a sequence, so it gets no number. */}
          {puzzle.steps.length === 1
            ? <p className="staff-page__step">{puzzle.steps[0]}</p>
            : <ol className="staff-page__steps">{puzzle.steps.map((item) => <Step key={item} item={item} />)}</ol>}
          {puzzle.note && <p className="staff-page__note">{puzzle.note}</p>}
          {tools}
          <ZoomImage {...puzzle.chart} className="staff-page__chart" />
          {extra}
        </section>
      </div>

      <div className="staff-page__side">
        <section className="origins-panel staff-block" id="upgrade" aria-labelledby="upgrade-title">
          <PanelTitle id="upgrade-title">Upgrade</PanelTitle>
          {upgrade.anyOrder && (
            <p className="staff-any-order"><strong>{`${upgrade.anyOrder.label}:`}</strong> {upgrade.anyOrder.text}</p>
          )}
          <ol className="staff-page__steps">{upgrade.steps.map((item) => <Step key={typeof item === 'string' ? item : item.text} item={item} />)}</ol>
          <ExcavationRings staffName={name} ring={ring} />
        </section>
      </div>
    </div>
  );
}
