import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList, { formatRange } from '../components/RevOptionList';
import eggData from '../data/eggData';
import '../styles/Reference.css';

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
            <div className="rev-panel-head">
              <span className="rev-kicker">Map area</span>
              <span className="rev-panel-count">{eggData.length}</span>
            </div>
            <div className="rev-segment" role="group" aria-label="Revelations map areas">
              {eggData.map((section) => (
                <button
                  type="button"
                  key={section.section}
                  className={section.section === currentCard.section ? 'active' : ''}
                  aria-pressed={section.section === currentCard.section}
                  onClick={() => handleSelectCard(section)}
                >
                  {section.section}
                </button>
              ))}
            </div>

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
      </section>
    </div>
  );
};

export default EggLocations;
