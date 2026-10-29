import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList, { formatRange } from '../components/RevOptionList';
import SummoningKeyData from '../data/SummoningKey';
import '../styles/Reference.css';

// Data names read "Throw 3: Shangri-La Focusing Stone"; the list already numbers each throw.
const options = SummoningKeyData.map((entry) => ({
  ...entry,
  key: entry.name,
  title: entry.name.replace(/^Throw \d+:\s*/, ''),
  meta: formatRange(entry.start, entry.end),
}));

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
