import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { FaRegSnowflake } from 'react-icons/fa';
import { GiWhirlwind, GiFireTail, GiLightningHelix, GiCrownedSkull, GiStopwatch, GiNotebook, GiScrollUnfurled } from 'react-icons/gi';
import SysShell from '../../../../shared/sys/SysShell';
import { SysBlock, SysPageHead } from '../../../../shared/sys/SysParts';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import BackToStep from '../../../../shared/guide/BackToStep';
import ZoomImage from '../../../../shared/ui/ZoomImage';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import originsGuide from '../data/originsGuide';
import originsStaffPages from '../data/originsStaffPages';
import { staffPlaces } from '../data/originsPlaces';
import Audio1 from '../assets/audio/origins_robot.mp3';
import Audio2 from '../assets/audio/zombie_intro.mp3';
import ReviveIcon from '../assets/images/Revive_Icon.png';
import SkullIcon from '../assets/images/Skull2.png';
import RobotArt from '../../public/images/Robot.webp?url';

/*
 * Origins in the candidate systems (preview only, ?design=a|b|c): the main guide and the Ice, Fire and Wind
 * staff pages. Same data files as the live pages, so no fact moves. Lightning (its switch board), Step details,
 * Speed Run and the original guide still open the live pages until a system is chosen.
 */
const BASE = '/maps/origins';
const TABS = [
  { to: BASE, label: 'Main guide', end: true, tone: '#6dc2ff', Icon: GiCrownedSkull },
  { to: `${BASE}/step-details`, label: 'Step details', tone: '#a9c6da', Icon: GiNotebook },
  { to: `${BASE}/ice-staff`, label: 'Ice Staff', tone: '#78e8e1', Icon: FaRegSnowflake },
  { to: `${BASE}/fire-staff`, label: 'Fire Staff', tone: '#ff8a5c', Icon: GiFireTail },
  { to: `${BASE}/wind-staff`, label: 'Wind Staff', tone: '#f4e06a', Icon: GiWhirlwind },
  { to: `${BASE}/lightning-staff`, label: 'Lightning Staff', tone: '#c9a2ff', Icon: GiLightningHelix },
  { to: `${BASE}/speed-run`, label: 'Speed Run', tone: '#f0c56b', Icon: GiStopwatch },
  { to: `${BASE}/og`, label: 'Original guide', tone: '#f1f8ff', Icon: GiScrollUnfurled },
];
export const SYS_PATHS = [BASE, `${BASE}/ice-staff`, `${BASE}/fire-staff`, `${BASE}/wind-staff`];

function Main() {
  return (
    <div className="sys-page sys-page--guide">
      <FlatGuide label="Little Lost Girl" steps={originsGuide} footer={<CompleteEasterEgg mapId="origins" />} />
      <section className="sys-extras" aria-label="Origins audio">
        <figure className="sys-audio">
          <figcaption>Giant robot radio message</figcaption>
          <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
        </figure>
        <figure className="sys-audio">
          <figcaption>Zombie intro</figcaption>
          <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
        </figure>
      </section>
      <p className="sys-credits">
        <em>MrRoflWaffles – Staff Images</em> · <a href="https://kronorium.com/" target="_blank" rel="noreferrer">Kronorium.com</a>
      </p>
    </div>
  );
}

const Line = ({ item }) => (typeof item === 'string' ? <li>{item}</li> : <li><strong>{`${item.label}:`}</strong> {item.text}</li>);

// One staff: Build, Puzzle (its code chart) and Upgrade. The document system leads with the chart, as the paper guide did.
function Staff({ staff, chartFirst }) {
  const { id, name, build, puzzle, upgrade, ring } = staff;
  const places = staffPlaces[id];
  const chart = <ZoomImage {...puzzle.chart} className="sys-chart" />;
  return (
    <div className="sys-page sys-page--staff" data-staff={id}>
      <SysPageHead step="Main guide steps 1 and 2" title={`${name} Staff`} />
      {chartFirst && <div className="sys-staff__lead">{chart}</div>}
      <div className="sys-staff">
        <div className="sys-staff__col">
          <SysBlock id="build" title="Build">
            <dl className="sys-facts">
              {build.map((row) => (
                <div key={row.k}><dt>{row.k}</dt><dd>{row.v}</dd></div>
              ))}
            </dl>
          </SysBlock>
          <SysBlock id="map" title="Spots">
            <ol className="sys-steps">{places.pins.map((pin) => <li key={pin.text}>{pin.text}</li>)}</ol>
          </SysBlock>
        </div>
        <div className="sys-staff__col">
          <SysBlock id="puzzle" title="Puzzle">
            {puzzle.pianoCode && (
              <div className="sys-chords" role="group" aria-label={`Piano code: ${puzzle.pianoCode.join(', ')}`}>
                <span className="sys-chords__label">Piano code</span>
                <ol>{puzzle.pianoCode.map((chord) => <li key={chord}>{chord}</li>)}</ol>
              </div>
            )}
            {!chartFirst && chart}
            {puzzle.steps.length === 1
              ? <p className="sys-step-one">{puzzle.steps[0]}</p>
              : <ol className="sys-steps">{puzzle.steps.map((item) => <Line key={item} item={item} />)}</ol>}
            {puzzle.note && <p className="sys-note">{puzzle.note}</p>}
          </SysBlock>
          <SysBlock id="upgrade" title="Upgrade">
            {upgrade.anyOrder && <p className="sys-note sys-note--lead"><strong>{`${upgrade.anyOrder.label}:`}</strong> {upgrade.anyOrder.text}</p>}
            <ol className="sys-steps">{upgrade.steps.map((item) => <Line key={typeof item === 'string' ? item : item.text} item={item} />)}</ol>
            <p className="sys-note">
              <strong>Four levers, four rings. </strong>
              Use the four levers to turn every ring <b>{ring.word}</b>, then shoot the {ring.orb} orb below them with the {name} Staff.
            </p>
          </SysBlock>
        </div>
      </div>
    </div>
  );
}

export default function OriginsSys({ design }) {
  const chartFirst = design === 'b';
  return (
    <SysShell
      design={design}
      mapId="origins"
      mapLine="Origins Easter Egg"
      questLine="Little Lost Girl"
      art={RobotArt}
      emblem={ReviveIcon}
      bullet={SkullIcon}
      tabs={TABS}
      navLabel="Origins guide navigation"
    >
      <BackToStep guidePath={BASE} steps={originsGuide} className="sys-back" />
      <Routes>
        <Route index element={<Main />} />
        <Route path="ice-staff" element={<Staff staff={originsStaffPages.ice} chartFirst={chartFirst} />} />
        <Route path="fire-staff" element={<Staff staff={originsStaffPages.fire} chartFirst={chartFirst} />} />
        <Route path="wind-staff" element={<Staff staff={originsStaffPages.wind} chartFirst={chartFirst} />} />
      </Routes>
    </SysShell>
  );
}
