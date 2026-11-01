import React from 'react';
import ZoomImage from '../../../../shared/ui/ZoomImage';
import useHashLanding from '../../../../shared/guide/useHashLanding';
import ExcavationRings from './ExcavationRings';
import '../Styles/PageStyles/StaffPage.css';

/*
 * One Origins staff as a field reference: Build → Puzzle → Upgrade.
 * Desktop keeps the puzzle reference (chart or Lightning's tools) on screen beside Build and Upgrade;
 * phones read the three sections in game order. Every line comes from originsStaffPages.js.
 */
const Step = ({ item }) => (typeof item === 'string'
  ? <li>{item}</li>
  : <li><strong>{`${item.label}:`}</strong> {item.text}</li>);

export default function StaffPage({ staff, tools = null, extra = null }) {
  const { id, name, build, puzzle, upgrade, ring } = staff;
  // Section links (#build, #puzzle, #upgrade, Lightning's #switches) land clear of the pinned nav.
  useHashLanding(['build', 'puzzle', 'upgrade', 'switches']);

  return (
    <div className={`staff-page${tools ? ' staff-page--tools' : ''}`} data-staff={id}>
      <div className="staff-page__hero">
        <h2>{name} Staff</h2>
        <nav className="staff-page__jump" aria-label={`${name} Staff sections`}>
          <a href="#build">Build</a>
          <a href="#puzzle">Puzzle</a>
          <a href="#upgrade">Upgrade</a>
        </nav>
      </div>

      <div className="staff-page__grid">
        <section className="staff-block staff-block--build" id="build" aria-labelledby="build-title">
          <h3 id="build-title">Build</h3>
          <dl className="staff-page__facts">
            {build.map((row) => (
              <div key={row.k}>
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="staff-block staff-block--puzzle" id="puzzle" aria-labelledby="puzzle-title">
          <h3 id="puzzle-title">Puzzle</h3>
          {puzzle.pianoCode && (
            <div className="staff-page__chords" aria-label={`Piano code: ${puzzle.pianoCode.join(', ')}`}>
              <span className="staff-page__label">Piano code</span>
              <ol>{puzzle.pianoCode.map((chord) => <li key={chord}>{chord}</li>)}</ol>
            </div>
          )}
          {!tools && <ZoomImage {...puzzle.chart} className="staff-page__chart" />}
          {/* A single step is not a sequence, so it gets no number. */}
          {puzzle.steps.length === 1
            ? <p className="staff-page__step">{puzzle.steps[0]}</p>
            : <ol className="staff-page__steps">{puzzle.steps.map((item) => <Step key={item} item={item} />)}</ol>}
          {puzzle.note && <p className="staff-page__note">{puzzle.note}</p>}
          {tools}
          {tools && <ZoomImage {...puzzle.chart} className="staff-page__chart" />}
          {extra}
        </section>

        <section className="staff-block staff-block--upgrade" id="upgrade" aria-labelledby="upgrade-title">
          <h3 id="upgrade-title">Upgrade</h3>
          {upgrade.anyOrder && (
            <div className="staff-any-order">
              <span className="staff-page__label">{upgrade.anyOrder.label}</span>
              <p>{upgrade.anyOrder.text}</p>
            </div>
          )}
          <ol className="staff-page__steps">{upgrade.steps.map((item) => <Step key={typeof item === 'string' ? item : item.text} item={item} />)}</ol>
          <ExcavationRings staffName={name} ring={ring} />
        </section>
      </div>
    </div>
  );
}
