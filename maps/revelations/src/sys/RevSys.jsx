import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../../../../shared/ui/NotFound';
import SysShell from '../../../../shared/sys/SysShell';
import { SysBlock, SysOptionList, SysPageHead, SysPicker, SysShots, SysWorkspace } from '../../../../shared/sys/SysParts';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import StepDetails from '../../../../shared/guide/StepDetails';
import BackToStep from '../../../../shared/guide/BackToStep';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import { formatRange } from '../components/RevOptionList';
import revGuideSteps from '../data/revGuideSteps';
import revStepDetails from '../data/stepDetails';
import upgradeData from '../data/ApothiconUpgradeData';
import eggData from '../data/eggData';
import SummoningKeyData from '../data/SummoningKey';
import soundStepData from '../data/SoundStepData';
import { boneSpots, servantRocks, turretShot } from '../data/revReferenceShots';
import HeaderArt from '../assets/images/Rev3.webp';

/*
 * Revelations in the candidate page system (preview only, ?design=a|b|c). Same data, same video segments and
 * same anchors (#servant-rocks, #bone-spots, #turret-shot, #step-N) as the live pages; only the presentation differs.
 */
const BASE = '/maps/revelations';
const TABS = [
  { to: BASE, label: 'Main Guide', end: true, tone: '#8fe3ff' },
  { to: `${BASE}/apothicon-upgrade`, label: 'Apothicon Upgrade', tone: '#c3a6ff' },
  { to: `${BASE}/egg-locations`, label: 'Egg Locations', tone: '#8be8b0' },
  { to: `${BASE}/summoning-key`, label: 'Summoning Key', tone: '#ffd27a' },
  { to: `${BASE}/sound-step`, label: 'Sound Step', tone: '#ff9fd0' },
  { to: `${BASE}/step-details`, label: 'Step details', tone: '#b6c6dd' },
];

function Main() {
  return (
    <div className="sys-page sys-page--guide">
      <FlatGuide label="For The Good Of All" steps={revGuideSteps} footer={<CompleteEasterEgg mapId="revelations" />} />
    </div>
  );
}

const upgradeOptions = upgradeData.map((item) => ({ ...item, key: item.name, title: item.name, meta: formatRange(item.start, item.end) }));

function Apothicon() {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const play = (item) => { setSelected(item); videoRef.current?.playSegment(item.start, item.end); };
  return (
    <div className="sys-page">
      <SysPageHead
        step="Main guide step 3"
        title="Apothicon Servant Upgrade"
        intro="Shoot all five blue sky rocks with the Apothicon Servant. Choose a location to play only that short segment."
      />
      <SysWorkspace
        video={<GuideVideoPlayer ref={videoRef} title="Apothicon Servant upgrade locations" caption="Choose a location to play only that segment." nowPlaying={selected?.name} />}
      >
        <SysBlock title="Rock locations" count={upgradeOptions.length}>
          <SysOptionList label="Apothicon upgrade locations" options={upgradeOptions} activeKey={selected?.name} onSelect={play} />
        </SysBlock>
      </SysWorkspace>
      <SysShots id="servant-rocks" title="Servant rock spots" intro="Each rock: where to aim, and where to stand." groups={servantRocks} />
    </div>
  );
}

const eggAreas = eggData.map((section) => ({ key: section.section, label: section.section, detail: `${section.locations.length} spots` }));

function Eggs() {
  const videoRef = useRef(null);
  const [area, setArea] = useState(eggData[0]);
  const [spot, setSpot] = useState(null);
  const pickArea = (key) => {
    const next = eggData.find((section) => section.section === key);
    setArea(next);
    setSpot(null);
    videoRef.current?.playSegment(next.sectionStart, next.sectionEnd);
  };
  const pickSpot = (location) => { setSpot(location.name); videoRef.current?.playSegment(location.start, location.end); };
  const options = area.locations.map((location) => ({ ...location, key: location.name, title: location.name, meta: formatRange(location.start, location.end) }));
  return (
    <div className="sys-page">
      <SysPageHead step="Main guide step 8" title="Egg Locations" intro="Choose the map area, then the spawn spot you are checking." />
      <SysWorkspace
        video={<GuideVideoPlayer ref={videoRef} title="Revelations egg locations" caption="Choose an area or spot to play only that clip." nowPlaying={spot ? `${area.section} · ${spot}` : null} />}
      >
        <SysBlock title="Map area">
          <SysPicker label="Map area" options={eggAreas} current={area.section} onPick={pickArea} />
        </SysBlock>
        <SysBlock title="Spawn spots" count={options.length}>
          <SysOptionList label={`${area.section} egg locations`} options={options} activeKey={spot} onSelect={pickSpot} />
        </SysBlock>
      </SysWorkspace>
      <SysShots
        id="bone-spots"
        title="Bone spots"
        intro="Shoot each bone with a Pack-a-Punched bullet weapon, then absorb it with the upgraded Servant."
        groups={boneSpots}
      />
      <SysShots id="turret-shot" title="Turret shot" groups={[{ id: 'turret', images: [turretShot] }]} />
    </div>
  );
}

// Data names read "Throw 3: Shangri-La Focusing Stone"; the list already numbers each throw.
const throwOptions = SummoningKeyData.map((entry) => ({
  ...entry,
  key: entry.name,
  title: entry.name.replace(/^Throw \d+:\s*/, ''),
  meta: formatRange(entry.start, entry.end),
}));

function Key() {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const play = (entry) => { setSelected(entry); videoRef.current?.playSegment(entry.start, entry.end); };
  return (
    <div className="sys-page">
      <SysPageHead
        step="Main guide step 11"
        title="Summoning Key Throws"
        intro="Seven throws, any order. Leave Nacht for last. Tap the target you need and jump straight to that throw."
      />
      <SysWorkspace
        video={<GuideVideoPlayer ref={videoRef} title="Revelations Summoning Key throws" caption="Choose a throw to play only that clip." nowPlaying={selected?.name} />}
      >
        <SysBlock title="Throw targets" count={throwOptions.length} note="Numbers are a suggested order: any order works, Nacht last.">
          <SysOptionList label="Summoning Key throws" options={throwOptions} activeKey={selected?.name} onSelect={play} />
        </SysBlock>
      </SysWorkspace>
    </div>
  );
}

const soundGroups = soundStepData.reduce((acc, entry) => { (acc[entry.area] ||= []).push(entry); return acc; }, {});
const soundAreas = Object.keys(soundGroups).map((key) => ({ key, label: key, detail: `${soundGroups[key].length} spots` }));
const toSeconds = (value) => { const [m, s] = value.trim().split(':').map(Number); return m * 60 + s; };
const endOf = (entry) => { const [, end] = entry.time.split('-'); return end ? toSeconds(end) : undefined; };

function Sound() {
  const videoRef = useRef(null);
  const [area, setArea] = useState(soundAreas[0].key);
  const [spot, setSpot] = useState(null);
  const options = soundGroups[area].map((entry) => ({ ...entry, key: `${entry.area}-${entry.label}`, title: entry.label, meta: entry.time.replace(/\s*-\s*/, ' – ') }));
  const pickSpot = (entry) => { setSpot(entry); videoRef.current?.playSegment(entry.start, endOf(entry)); };
  return (
    <div className="sys-page">
      <SysPageHead step="Main guide step 9" title="Sound Step" intro="Pick the region you are checking, then the exact spot to hear that reference segment." />
      <SysWorkspace
        video={<GuideVideoPlayer ref={videoRef} title="Revelations Rune of Creation sound-step locations" caption="The video only jumps when you choose a spot." nowPlaying={spot ? `${area} · ${spot.label}` : null} />}
      >
        <SysBlock title="Region">
          <SysPicker label="Region" options={soundAreas} current={area} onPick={(key) => { setSpot(null); setArea(key); }} />
        </SysBlock>
        <SysBlock title="Spots" count={options.length}>
          <SysOptionList label={`${area} sound step locations`} options={options} activeKey={spot ? `${spot.area}-${spot.label}` : null} onSelect={pickSpot} />
        </SysBlock>
      </SysWorkspace>
    </div>
  );
}

function Details() {
  return (
    <div className="sys-page sys-page--guide">
      <StepDetails steps={revStepDetails} title="Step details" />
    </div>
  );
}

export default function RevSys({ design }) {
  return (
    <SysShell
      design={design}
      mapId="revelations"
      mapLine="Revelations Easter Egg Guide"
      questLine="For The Good Of All — and A Better Tomorrow"
      art={HeaderArt}
      tabs={TABS}
      navLabel="Revelations guide navigation"
    >
      <BackToStep guidePath={BASE} steps={revGuideSteps} className="sys-back" />
      <Routes>
        <Route index element={<Main />} />
        <Route path="apothicon-upgrade" element={<Apothicon />} />
        <Route path="egg-locations" element={<Eggs />} />
        <Route path="summoning-key" element={<Key />} />
        <Route path="sound-step" element={<Sound />} />
        <Route path="step-details" element={<Details />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SysShell>
  );
}
