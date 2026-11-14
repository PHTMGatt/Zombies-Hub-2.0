import React, { useId } from 'react';
import { TUNNELS } from '../data/originsPlaces';
import '../Styles/ComponentStyles/OriginsMap.css';

/*
 * Origins as a zone sketch: Church at the top, Spawn at the bottom, the Excavation's four rings in the
 * middle of No Man's Land, the four staff tunnels in their colours, and the Crazy Place as an inset.
 * Pins are numbered, shaped by kind (spot, part, record, tunnel, target) and listed in the key below,
 * so every spot is said in words as well as shown. Not to scale.
 */
const PinShape = ({ kind }) => {
  switch (kind) {
    case 'part':
      return <rect x="-8.5" y="-8.5" width="17" height="17" rx="2.5" />;
    case 'record':
      return (
        <>
          <circle r="12" className="omap__record-ring" />
          <circle r="9" />
        </>
      );
    case 'gate':
      return <path d="M-8.5 9.5 V-1 A8.5 8.5 0 0 1 8.5 -1 V9.5 Z" />;
    case 'target':
      return <polygon points="0,-11.5 11.5,0 0,11.5 -11.5,0" />;
    default:
      return <circle r="9.5" />;
  }
};

const Pin = ({ pin, n }) => (
  <g className={`omap__pin omap__pin--${pin.kind}`} transform={`translate(${pin.x} ${pin.y})`}>
    <PinShape kind={pin.kind} />
    <text dy="0.36em">{n}</text>
  </g>
);

// Zones: [id, x, y, w, h, name, landmark]
const ZONE_BOXES = [
  ['church', 110, 24, 100, 58, 'Church', 'Gen 6'],
  ['gen4', 12, 150, 88, 62, 'Gen 4', 'Juggernog'],
  ['gen5', 220, 150, 88, 62, 'Gen 5', 'Stamin-Up'],
  ['gen3', 20, 270, 90, 50, 'Gen 3', ''],
  ['gen2', 210, 270, 94, 62, 'Gen 2', 'Tank Station'],
  ['spawn', 118, 324, 84, 46, 'Spawn', 'Gen 1'],
];

// Trenches between the zones, drawn first so everything else sits on top.
const TRENCHES = [
  'M160 346 C 124 342, 92 322, 66 296',
  'M160 346 C 196 342, 228 322, 256 296',
  'M66 296 C 56 262, 52 236, 56 212',
  'M256 296 C 266 262, 270 236, 264 212',
  'M56 150 C 62 104, 82 66, 110 54',
  'M264 150 C 258 104, 238 66, 210 54',
  'M100 186 L 122 186',
  'M220 186 L 198 186',
  'M160 82 L 160 148',
  'M160 324 L 160 224',
];

// Robot walk lines: [name, line y, label x, label y]. Each label sits where no pin, tunnel or zone name
// can cover it on the views that show robots (Ascend from Darkness, Rain Fire, the Wind staff map):
// Odin just under its line between Generator 4 and the Excavation, Thor above its line right of centre.
const ROBOTS = [
  ['Freya', 100, 8, 94],
  ['Odin', 186, 101, 199],
  ['Thor', 262, 222, 256],
];

export default function OriginsMap({ pins = [], layers = [], title, empty = null, className = '', id }) {
  const titleId = useId();
  const show = new Set(layers);
  return (
    <figure className={`omap ${className}`} id={id}>
      <svg viewBox="0 0 320 380" role="img" aria-labelledby={titleId} className="omap__svg">
        <title id={titleId}>{`${title}. Origins map sketch, not to scale${pins.length ? `, ${pins.length} marked spots listed below` : ''}.`}</title>

        <g className="omap__trenches">
          {TRENCHES.map((d) => <path key={d} d={d} />)}
        </g>

        {show.has('robots') && (
          <g className="omap__robots">
            {ROBOTS.map(([name, y, labelX, labelY]) => (
              <g key={name}>
                <path d={`M6 ${y} H314`} />
                <text x={labelX} y={labelY}>{name}</text>
              </g>
            ))}
          </g>
        )}

        {show.has('tank') && (
          <g className="omap__tank">
            {/* Out on the Generator 5 side to the Church, back past Generator 4 to the Tank Station. */}
            <path d="M257 300 C 302 284, 314 222, 304 164 C 296 112, 254 72, 212 60" />
            <path d="M108 60 C 62 70, 20 112, 20 172 C 20 232, 82 254, 160 254 C 210 254, 238 272, 252 292" />
          </g>
        )}

        <g className="omap__zones">
          {ZONE_BOXES.map(([id, x, y, w, h, name, landmark]) => (
            <g key={id}>
              <rect x={x} y={y} width={w} height={h} rx="14" />
              <text x={x + w / 2} y={y + 20} className="omap__zone-name">{name}</text>
              {landmark && <text x={x + w / 2} y={y + 33} className="omap__zone-mark">{landmark}</text>}
            </g>
          ))}
        </g>

        <g className="omap__dig" aria-hidden="true">
          {[40, 31, 22, 13].map((r) => <circle key={r} cx="160" cy="186" r={r} />)}
          <text x="160" y="244" className="omap__zone-name">Excavation</text>
        </g>

        <g className="omap__crazy">
          <rect x="6" y="8" width="90" height="70" rx="10" />
          <text x="51" y="24" className="omap__zone-mark">Crazy Place</text>
          {['ice', 'fire', 'wind', 'lightning'].map((staff, i) => (
            <circle key={staff} cx={i % 2 ? 72 : 30} cy={i < 2 ? 42 : 64} r="4.5" className={`omap__tone omap__tone--${staff}`} />
          ))}
        </g>

        <g className="omap__tunnels">
          {TUNNELS.map((tunnel) => (
            <path key={tunnel.staff} transform={`translate(${tunnel.x} ${tunnel.y})`} d="M-6 6 V0 A6 6 0 0 1 6 0 V6 Z" className={`omap__tone omap__tone--${tunnel.staff}`} />
          ))}
        </g>

        <g className="omap__pins">
          {pins.map((pin, i) => <Pin key={`${pin.x}-${pin.y}-${pin.text}`} pin={pin} n={i + 1} />)}
        </g>
      </svg>

      <figcaption className="omap__key">
        {pins.length > 0 ? (
          <ol>
            {pins.map((pin, i) => (
              <li key={pin.text} className={`omap__key-item omap__pin--${pin.kind}`}>
                <svg viewBox="-13 -13 26 26" aria-hidden="true" className="omap__key-pin">
                  <g className={`omap__pin omap__pin--${pin.kind}`}>
                    <PinShape kind={pin.kind} />
                    <text dy="0.36em">{i + 1}</text>
                  </g>
                </svg>
                <span>{pin.text}</span>
              </li>
            ))}
          </ol>
        ) : empty}
        {show.has('tank') && <p className="omap__note"><span className="omap__swatch omap__swatch--tank" aria-hidden="true" />Tank route: out past Generator 5 to the Church, back past Generator 4.</p>}
        <p className="omap__note omap__note--scale">Sketch, not to scale.</p>
      </figcaption>
    </figure>
  );
}
