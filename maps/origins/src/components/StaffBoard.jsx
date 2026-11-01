import React from 'react';
import { Link } from 'react-router-dom';

/*
 * The Origins staff board: all four staffs at once, each in its own colour, read straight from the
 * step data (the tabs of "Build the four staffs" and "Upgrade the staffs").
 *   layout "board"   – desktop side board (build facts), one block per staff
 *   layout "columns" – desktop upgrade lines, four colour-topped columns
 *   layout "rows"    – phone / landscape: one tap-to-open row per staff, all closed at first
 * Code charts are not repeated here: their home is each staff page.
 */
const staffTabs = (step) => step.refs.find((ref) => ref.type === 'tabs').tabs;
const staffPage = (id) => `/maps/origins/${id}-staff`;

function BuildFacts({ tab }) {
  const items = tab.refs.filter((ref) => ref.type === 'facts').flatMap((ref) => ref.items);
  return (
    <dl className="staff-facts">
      {items.map((item) => (
        <div key={item.k}>
          <dt>{item.k}</dt>
          <dd>{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function UpgradeLines({ tab }) {
  return (
    <div className="staff-upgrade__body">
      {tab.refs.map((ref, index) => {
        const key = `${ref.type}-${index}`;
        if (ref.type === 'sequence') {
          return (
            <div key={key} className="staff-upgrade__code">
              {ref.label && <span className="staff-upgrade__label">{ref.label}</span>}
              <ol>{ref.items.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
          );
        }
        if (ref.type === 'list') {
          // An unordered list is shown without numbers: it makes no claim about the order of its lines.
          return ref.unordered
            ? <ul key={key} className="staff-upgrade__either">{ref.items.map((item) => <li key={item}>{item}</li>)}</ul>
            : <ol key={key} className="staff-upgrade__steps">{ref.items.map((item) => <li key={item}>{item}</li>)}</ol>;
        }
        return null;
      })}
    </div>
  );
}

function StaffLinks({ tab }) {
  return (
    <p className="staff-links">
      {(tab.links ?? []).map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
      <Link to={staffPage(tab.id)}>{tab.label} Staff page</Link>
    </p>
  );
}

export default function StaffBoard({ step, mode, layout, className = '' }) {
  const tabs = staffTabs(step);
  const Body = mode === 'build' ? BuildFacts : UpgradeLines;
  const hint = mode === 'build' ? 'Parts, record, crystal' : 'Puzzle, rings, charge';

  if (layout === 'rows') {
    return (
      <div className={`staff-rows ${className}`.trim()}>
        {tabs.map((tab) => (
          <details key={tab.id} className="staff-row" data-staff={tab.id}>
            <summary>
              <strong>{tab.label}</strong>
              <span className="staff-row__hint">{hint}</span>
            </summary>
            <Body tab={tab} />
            <StaffLinks tab={tab} />
          </details>
        ))}
      </div>
    );
  }

  if (layout === 'columns') {
    return (
      <div className={`staff-columns ${className}`.trim()}>
        {tabs.map((tab) => (
          <section key={tab.id} className="staff-upgrade" data-staff={tab.id} aria-label={`${tab.label} Staff upgrade`}>
            <h4>{tab.label}</h4>
            <Body tab={tab} />
            <StaffLinks tab={tab} />
          </section>
        ))}
      </div>
    );
  }

  const build = step.refs.filter((ref) => ref.type === 'facts').flatMap((ref) => ref.items);
  return (
    <aside className={`staff-board ${className}`.trim()} aria-labelledby="staff-board-title">
      <div className="staff-board__head">
        <h2 id="staff-board-title">Staff board</h2>
        <span>Where every piece comes from</span>
      </div>
      {tabs.map((tab) => (
        <section key={tab.id} className="staff-board__staff" data-staff={tab.id} aria-label={`${tab.label} Staff`}>
          <div className="staff-board__name">
            <strong>{tab.label}</strong>
            <Link to={staffPage(tab.id)}>{tab.label} Staff page</Link>
          </div>
          <BuildFacts tab={tab} />
        </section>
      ))}
      {build.map((item) => <p key={item.k} className="staff-board__foot"><b>{item.k}</b> {item.v}</p>)}
    </aside>
  );
}

export { staffTabs };
