import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepItem } from '../../../../shared/guide/GuideSteps';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import RevIslandMap from '../components/RevIslandMap';
import revGuideSteps from '../data/revGuideSteps';
import '../styles/MainGuide.css';

/*
 * For The Good Of All is a scavenger hunt across every old map, so the guide is one step at a time:
 * pick a step (numbered chips on phones, the step list on wide screens), see only that step, and, when
 * the step sends you around the islands, which ones light up. The selected step lives in the URL hash
 * (#servant), so search results and shared links open on it.
 *
 * Islands per step come from each step's own data (its tabs, tasks and chips) and the 2026-11-13 source
 * check (research:zombies:2026-11-13): engines and turrets on the four engine islands, the five Servant
 * rocks, the three possible triangle-rock pads, the six bones, the seven key throws.
 */
const STEP_ISLANDS = {
  engines: { lit: ['spawn', 'de', 'verruckt', 'mob', 'nacht'], note: 'Tombstones at Spawn, an engine on four islands, the console at Nacht.' },
  servant: { lit: ['spawn', 'shang', 'verruckt', 'mob', 'nacht'], note: 'A blue rock above each of these five.' },
  'reel-1': { lit: ['shang', 'mob', 'verruckt', 'nacht'], note: 'The triangle rock is on one of three jump pads; the reel plays at Nacht.' },
  'reel-3': { lit: ['spawn', 'shang', 'origins', 'verruckt', 'de', 'nacht'], note: 'One bone on each of these six.' },
  sophia: { lit: ['spawn', 'de', 'verruckt', 'mob', 'nacht'], note: 'A turret at each engine, then S.O.P.H.I.A. at Nacht.' },
  throws: { lit: ['kino', 'de', 'shang', 'origins', 'mob', 'verruckt', 'nacht'], note: 'One target on each of these seven.' },
};

const ids = revGuideSteps.map((step) => step.id);
const fragment = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};

const MainGuide = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const pickerRef = useRef(null);
  const fromHash = fragment(hash);
  const selectedId = ids.includes(fromHash) ? fromHash : ids[0];
  const index = ids.indexOf(selectedId);
  const step = revGuideSteps[index];
  const prev = revGuideSteps[index - 1];
  const next = revGuideSteps[index + 1];
  const islands = STEP_ISLANDS[step.id];

  // A deep link lands on the picker once, so the step and its chips are both in view.
  useEffect(() => {
    if (ids.includes(fragment(window.location.hash))) pickerRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, []);

  const select = (id) => navigate({ hash: `#${id}` }, { replace: true, preventScrollReset: true });
  const onKey = (event) => {
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const target = ids[(index + move + ids.length) % ids.length];
    select(target);
    document.getElementById(`rev-tab-${target}`)?.focus();
  };

  return (
    <div className="rev-page rev-main-guide">
      <div className="rev-run">
        <header className="rev-run-header">
          <h2>For The Good Of All</h2>
          <p>Twelve steps across every old map. Screenshots show where to aim.</p>
        </header>

        <div className="rev-picker" ref={pickerRef}>
          <div className="rev-chips" role="tablist" aria-label="For The Good Of All steps" aria-orientation="vertical" onKeyDown={onKey} data-step-tabs>
            {revGuideSteps.map((item, i) => {
              const on = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  id={`rev-tab-${item.id}`}
                  type="button"
                  role="tab"
                  className="rev-chip"
                  aria-selected={on}
                  aria-controls="rev-step-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(item.id)}
                >
                  <span className="rev-chip__n">{i + 1}</span>
                  <span className="rev-chip__title">{item.title}</span>
                </button>
              );
            })}
          </div>

          <section className="guide rev-card" role="tabpanel" id="rev-step-panel" aria-labelledby={`rev-tab-${step.id}`}>
            <div className="rev-card__mark" aria-hidden="true">{index + 1}</div>
            <ol className="guide-seq rev-card__step" start={index + 1}>
              <StepItem key={step.id} step={step} />
            </ol>
            {islands && (
              <RevIslandMap className="rev-card__isles" title={islands.note} lit={islands.lit} />
            )}
            <nav className="rev-card__walk" aria-label="Previous and next step">
              {prev ? (
                <button type="button" onClick={() => select(prev.id)}>
                  <small>Back</small>
                  <span>{index}. {prev.title}</span>
                </button>
              ) : <span />}
              {next ? (
                <button type="button" className="rev-card__next" onClick={() => select(next.id)}>
                  <small>Next</small>
                  <span>{index + 2}. {next.title}</span>
                </button>
              ) : <span />}
            </nav>
          </section>
        </div>

        <div className="guide-seq__footer rev-run__done"><CompleteEasterEgg mapId="revelations" /></div>
      </div>
    </div>
  );
};

export default MainGuide;
