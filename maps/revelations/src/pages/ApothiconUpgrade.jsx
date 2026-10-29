import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList, { formatRange } from '../components/RevOptionList';
import upgradeData from '../data/ApothiconUpgradeData';
import '../styles/Reference.css';

const options = upgradeData.map((item) => ({
  ...item,
  key: item.name,
  title: item.name,
  meta: formatRange(item.start, item.end),
}));

const ApothiconUpgrade = () => {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const handlePlay = (item) => {
    setSelected(item);
    videoRef.current?.playSegment(item.start, item.end);
  };

  return (
    <div className="rev-page rev-reference-page apothicon-upgrade-page">
      <section className="rev-shell">
        <RevSectionHeader
          kicker="Quick Reference · Step 03"
          title="Apothicon Servant Upgrade"
          intro="Shoot all five blue sky rocks with the Apothicon Servant. Choose a location to play only that short segment."
        />

        <div className="rev-workspace">
          <div className="rev-workspace__media">
            <GuideVideoPlayer
              ref={videoRef}
              title="Apothicon Servant upgrade locations"
              caption="Choose a location to play only that segment."
              nowPlaying={selected?.name}
            />
          </div>

          <aside className="rev-workspace__panel">
            <div className="rev-panel-head">
              <span className="rev-kicker">Rock locations</span>
              <span className="rev-panel-count">{options.length}</span>
            </div>
            <RevOptionList
              label="Apothicon upgrade locations"
              options={options}
              activeKey={selected?.name}
              onSelect={handlePlay}
            />
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ApothiconUpgrade;
