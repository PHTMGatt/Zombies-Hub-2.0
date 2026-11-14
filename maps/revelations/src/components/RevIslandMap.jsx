import React from 'react';
import './RevIslandMap.css';

/*
 * Revelations as what it is: the old maps as floating islands around Nacht der Untoten. A ring sketch,
 * not to scale: Spawn → Shangri-La → Der Eisendrache → Kino → Verrückt → Mob of the Dead → Origins → back
 * to Spawn, each link a jump pad (dashed) or a walkway (solid), with Nacht's portals in the middle.
 *
 * Links come from the guide's own landmarks (research:zombies:2026-11-13, revelations.md): the Spawn pads
 * to Shangri-La and Origins, the Shangri-La / Der Eisendrache doorway, Kino's Undercroft ramp, the
 * Verrückt pads to Kino and Mob, the Mob / Origins tunnel, and the Nacht portals to the four engines.
 *
 * Static (lit islands only) on the Main Guide; a picker on the hunt pages, where each island is a real
 * button and `area` groups islands that share one hunt area.
 */
export const ISLANDS = [
  { id: 'spawn', short: 'Spawn', name: 'Spawn', x: 180, y: 42 },
  { id: 'shang', short: 'Shangri-La', name: 'Shangri-La', x: 280, y: 83 },
  { id: 'de', short: 'Der Eisendrache', name: 'Der Eisendrache', x: 305, y: 174 },
  { id: 'kino', short: 'Kino', name: 'Kino der Toten', x: 236, y: 247 },
  { id: 'verruckt', short: 'Verrückt', name: 'Verrückt', x: 124, y: 247 },
  { id: 'mob', short: 'Mob', name: 'Mob of the Dead', x: 55, y: 174 },
  { id: 'origins', short: 'Origins', name: 'Origins', x: 80, y: 83 },
  { id: 'nacht', short: 'Nacht', name: 'Nacht der Untoten', x: 180, y: 150 },
];

// [from, to, kind]: pad = jump pad, walk = same ground, portal = Nacht portal.
const LINKS = [
  ['spawn', 'shang', 'pad'],
  ['shang', 'de', 'walk'],
  ['de', 'kino', 'walk'],
  ['kino', 'verruckt', 'pad'],
  ['verruckt', 'mob', 'pad'],
  ['mob', 'origins', 'walk'],
  ['origins', 'spawn', 'pad'],
  ['nacht', 'spawn', 'portal'],
  ['nacht', 'de', 'portal'],
  ['nacht', 'verruckt', 'portal'],
  ['nacht', 'mob', 'portal'],
];

const W = 360;
const H = 300;
const at = (id) => ISLANDS.find((isle) => isle.id === id);

// Ring links bow outward a little; portals run straight from the centre.
function linkPath(from, to, kind) {
  const a = at(from);
  const b = at(to);
  if (kind === 'portal') return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const cx = mx + (mx - 180) * 0.18;
  const cy = my + (my - 150) * 0.18;
  return `M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}`;
}

// A floating rock: a flat top with a jagged underside.
const Rock = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path className="rev-isles__under" d="M-27 -2 L-15 9 L-7 20 L0 12 L8 19 L15 8 L27 -2 Z" />
    <ellipse className="rev-isles__top" rx="27" ry="9" cy="-3" />
  </g>
);

/*
 * The one hunt picker: pick where you are on the island ring, see its spots in the list beside it.
 * `areas` are [{ key, label, islands }]; an area can span islands (Spawn / Shangri-La), and tapping any
 * of its islands picks it. `counts` puts a small number on an island (the Summoning Key throw order),
 * `pickLabel(isle, area)` names an island button for screen readers, and `hint` replaces the caption.
 * Used by every hunt page, so they all work the same way.
 */
const areaLabel = (isle, area) => `${isle.name}: ${area.label}`;

export function RevAreaPicker({ areas, current, onPick, kicker = 'Where you are', noun = 'spots', hint, counts, pickLabel = areaLabel }) {
  const area = areas.find((item) => item.key === current);
  const byIsland = (id) => areas.find((item) => item.islands.includes(id));
  return (
    <div className="rev-area" data-area-picker>
      <div className="rev-area__head">
        <span className="rev-kicker">{kicker}</span>
        <strong>{area?.label ?? 'Pick an island'}</strong>
      </div>
      <RevIslandMap
        title={hint ?? `Tap an island to see its ${noun}.`}
        lit={areas.flatMap((item) => item.islands)}
        active={area?.islands ?? []}
        onPick={(id) => onPick(byIsland(id).key)}
        pickLabel={(isle) => pickLabel(isle, byIsland(isle.id))}
        counts={counts}
      />
    </div>
  );
}

export default function RevIslandMap({
  title,
  lit = [],
  active = [],
  counts = {},
  onPick = null,
  pickLabel = (isle) => isle.name,
  className = '',
}) {
  const litSet = new Set(lit);
  const activeSet = new Set(active);
  const state = (id) => (activeSet.has(id) ? 'is-active' : litSet.has(id) ? 'is-lit' : 'is-dim');
  // Numbered islands (the throw order) are tabbed through in that order, not round the ring.
  const order = (isle) => counts[isle.id] ?? ISLANDS.length + ISLANDS.indexOf(isle);
  const overlay = [...ISLANDS].sort((a, b) => order(a) - order(b));
  // The static ring (Main Guide) is drawn for the eyes only, so its caption names the lit islands.
  const litNames = onPick ? [] : ISLANDS.filter((isle) => litSet.has(isle.id)).map((isle) => isle.name);
  return (
    <figure className={`rev-isles${onPick ? ' rev-isles--picker' : ''} ${className}`}>
      <div className="rev-isles__field">
        <svg viewBox={`0 0 ${W} ${H}`} className="rev-isles__svg" aria-hidden="true">
          {LINKS.map(([from, to, kind]) => {
            const on = (litSet.has(from) || activeSet.has(from)) && (litSet.has(to) || activeSet.has(to));
            return <path key={`${from}-${to}`} d={linkPath(from, to, kind)} className={`rev-isles__link rev-isles__link--${kind}${on ? ' is-on' : ''}`} />;
          })}
          {ISLANDS.map((isle) => (
            <g key={isle.id} className={`rev-isles__rock ${state(isle.id)}`}>
              <Rock x={isle.x} y={isle.y} />
            </g>
          ))}
        </svg>
        {overlay.map((isle) => {
          const style = { left: `${(isle.x / W) * 100}%`, top: `${(isle.y / H) * 100}%` };
          const count = counts[isle.id];
          const body = (
            <>
              <span className="rev-isle__name">{isle.short}</span>
              {count != null && <span className="rev-isle__count">{count}</span>}
            </>
          );
          if (onPick && (litSet.has(isle.id) || activeSet.has(isle.id))) {
            return (
              <button
                key={isle.id}
                type="button"
                className={`rev-isle ${state(isle.id)}`}
                style={style}
                aria-pressed={activeSet.has(isle.id)}
                aria-label={pickLabel(isle)}
                onClick={() => onPick(isle.id)}
              >
                {body}
              </button>
            );
          }
          return <span key={isle.id} className={`rev-isle ${state(isle.id)}`} style={style} aria-hidden="true">{body}</span>;
        })}
      </div>
      <figcaption className="rev-isles__caption">
        {title}
        {litNames.length > 0 && <span className="rev-isles__sr">{` Islands: ${litNames.join(', ')}.`}</span>}
        <span className="rev-isles__legend" aria-hidden="true">
          <span className="rev-isles__key rev-isles__key--pad" />jump pad
          <span className="rev-isles__key rev-isles__key--walk" />walk
          <span className="rev-isles__key rev-isles__key--portal" />Nacht portal
        </span>
      </figcaption>
    </figure>
  );
}
