import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList, { formatRange } from '../components/RevOptionList';
import { RevAreaPicker } from '../components/RevIslandMap';
import RevShotSection from '../components/RevShotSection';
import { boneSpots, turretShot } from '../data/revReferenceShots';
import eggData from '../data/eggData';
import { EGG_ISLANDS } from '../data/revIslands';
import '../styles/Reference.css';

const areas = eggData.map((section) => ({ key: section.section, label: section.section, islands: EGG_ISLANDS[section.section] }));

const EggLocations = () => {
  const videoRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(eggData[0]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectCard = (section) => {
    setCurrentCard(section);
    setSelectedLocation(null);
    videoRef.current?.playSegment(section.sectionStart, section.sectionEnd);
  };

  const handleLocation = (location) => {
    setSelectedLocation(location.name);
    videoRef.current?.playSegment(location.start, location.end);
  };

  const options = currentCard.locations.map((location) => ({
    ...location,
    key: location.name,
    title: location.name,
    meta: formatRange(location.start, location.end),
  }));

  return (
    <div className="rev-page rev-reference-page egg-locations-page">
      <section className="rev-shell">
        <RevSectionHeader
          kicker="Location Reference · Step 08"
          title="Egg Locations"
          intro="Choose the map area, then the spawn spot you are checking."
        />

        <div className="rev-workspace">
          <div className="rev-workspace__media">
            <GuideVideoPlayer
              ref={videoRef}
              title="Revelations egg locations"
              caption="Choose an area or spot to play only that clip."
              nowPlaying={selectedLocation ? `${currentCard.section} · ${selectedLocation}` : null}
            />
          </div>

          <aside className="rev-workspace__panel">
            <RevAreaPicker
              kicker="Map area"
              noun="egg spots"
              areas={areas}
              current={currentCard.section}
              onPick={(key) => handleSelectCard(eggData.find((section) => section.section === key))}
            />

            <div className="rev-panel-head">
              <span className="rev-kicker">Spawn spots</span>
              <span className="rev-panel-count">{options.length}</span>
            </div>
            <RevOptionList
              label={`${currentCard.section} egg locations`}
              options={options}
              activeKey={selectedLocation}
              onSelect={handleLocation}
            />
          </aside>
        </div>

        <RevShotSection
          id="bone-spots"
          title="Bone spots"
          intro="Shoot each bone with a Pack-a-Punched bullet weapon, then absorb it with the upgraded Servant."
          groups={boneSpots}
        />
        <RevShotSection id="turret-shot" title="Turret shot" groups={[{ id: 'turret', images: [turretShot] }]} />
      </section>
    </div>
  );
};

export default EggLocations;
