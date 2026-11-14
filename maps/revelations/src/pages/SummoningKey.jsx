import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList, { formatRange } from '../components/RevOptionList';
import { RevAreaPicker } from '../components/RevIslandMap';
import SummoningKeyData from '../data/SummoningKey';
import '../styles/Reference.css';

// Data names read "Throw 3: Shangri-La Focusing Stone"; the list already numbers each throw.
const options = SummoningKeyData.map((entry) => ({
  ...entry,
  key: entry.name,
  title: entry.name.replace(/^Throw \d+:\s*/, ''),
  meta: formatRange(entry.start, entry.end),
}));

// Each throw's target sits on one island; the map name leads each title ("Mob Cell Poster").
const ISLAND_BY_MAP = { Kino: 'kino', DE: 'de', 'Shangri-La': 'shang', Origins: 'origins', Mob: 'mob', Verrückt: 'verruckt', Nacht: 'nacht' };
const islandOf = (option) => ISLAND_BY_MAP[option.title.split(' ')[0]];
const areas = options.map((option) => ({ key: option.key, label: option.title, islands: [islandOf(option)] }));
// The throw order, as a small number on each island.
const throwOrder = Object.fromEntries(options.map((option, index) => [islandOf(option), index + 1]));

function SummoningKey() {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const handleTimestampClick = (entry) => {
    setSelected(entry);
    videoRef.current?.playSegment(entry.start, entry.end);
  };

  return (
    <div className="rev-page rev-reference-page summoning-key-page">
      <section className="rev-shell">
        <RevSectionHeader
          kicker="Quick Reference · Step 11"
          title="Summoning Key Throws"
          intro="Seven throws, in order. Tap the target you need and jump straight to that throw."
        />

        <div className="rev-workspace">
          <div className="rev-workspace__media">
            <GuideVideoPlayer
              ref={videoRef}
              title="Revelations Summoning Key throws"
              caption="Choose a throw to play only that clip."
              nowPlaying={selected?.name}
            />
          </div>

          <aside className="rev-workspace__panel">
            <RevAreaPicker
              kicker="Throw target"
              areas={areas}
              current={selected?.name}
              counts={throwOrder}
              hint="Tap an island to play its throw. Numbers are the throw order."
              onPick={(key) => handleTimestampClick(options.find((option) => option.key === key))}
            />

            <div className="rev-panel-head">
              <span className="rev-kicker">Throw order</span>
              <span className="rev-panel-count">{options.length}</span>
            </div>
            <RevOptionList
              label="Summoning Key throws"
              options={options}
              activeKey={selected?.name}
              onSelect={handleTimestampClick}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}

export default SummoningKey;
